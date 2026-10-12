<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method_not_allowed'], JSON_UNESCAPED_UNICODE);
  exit;
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'config_missing'], JSON_UNESCAPED_UNICODE);
  exit;
}

/** @var array{smtp_host:string,smtp_port:int,smtp_user:string,smtp_pass:string,mail_from:string,mail_from_name:string,mail_to:string} $cfg */
$cfg = require $configPath;

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
  $data = $_POST;
}

// Honeypot
if (!empty($data['website'])) {
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$contact = trim((string)($data['contact'] ?? ''));
$task = trim((string)($data['task'] ?? ''));
$source = trim((string)($data['source'] ?? 'site'));

$errors = [];
if (mb_strlen($name) < 2) {
  $errors[] = 'name';
}
$digits = preg_replace('/\D+/', '', $phone) ?: '';
$hasPhone = strlen($digits) >= 10;
$hasContact = $contact !== '' && (filter_var($contact, FILTER_VALIDATE_EMAIL) || strlen(preg_replace('/\D+/', '', $contact) ?: '') >= 10);
if (!$hasPhone && !$hasContact) {
  $errors[] = 'phone_or_contact';
}
if ($errors) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => $errors], JSON_UNESCAPED_UNICODE);
  exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/nic_ecolog_form_' . hash('sha256', $ip);
$now = time();
$hits = [];
if (is_file($rateFile)) {
  $hits = array_filter(array_map('intval', explode("\n", (string)file_get_contents($rateFile))), static fn($t) => $t > $now - 3600);
}
if (count($hits) >= 8) {
  http_response_code(429);
  echo json_encode(['ok' => false, 'error' => 'rate_limit'], JSON_UNESCAPED_UNICODE);
  exit;
}
$hits[] = $now;
file_put_contents($rateFile, implode("\n", $hits) . "\n", LOCK_EX);

$replyContact = $hasPhone ? $phone : $contact;
$subject = 'Заявка с сайта nic-ecolog.ru';
$bodyLines = [
  'Новая заявка с сайта НИЦ «Эколог»',
  '',
  'Имя: ' . $name,
  'Контакт: ' . $replyContact,
];
if ($phone !== '' && $contact !== '' && $phone !== $contact) {
  $bodyLines[] = 'Доп. контакт: ' . ($hasPhone ? $contact : $phone);
}
if ($task !== '') {
  $bodyLines[] = 'Задача: ' . $task;
}
$bodyLines[] = 'Источник: ' . $source;
$bodyLines[] = 'IP: ' . $ip;
$bodyLines[] = 'Время: ' . gmdate('Y-m-d H:i:s') . ' UTC';
$body = implode("\n", $bodyLines);

try {
  smtp_send($cfg, $subject, $body, $replyContact);
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'send_failed'], JSON_UNESCAPED_UNICODE);
}

/**
 * @param array{smtp_host:string,smtp_port:int,smtp_user:string,smtp_pass:string,mail_from:string,mail_from_name:string,mail_to:string} $cfg
 */
function smtp_send(array $cfg, string $subject, string $body, string $replyTo): void
{
  $host = $cfg['smtp_host'];
  $port = (int)$cfg['smtp_port'];
  $errno = 0;
  $errstr = '';
  $socket = stream_socket_client(
    "ssl://{$host}:{$port}",
    $errno,
    $errstr,
    20,
    STREAM_CLIENT_CONNECT,
    stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
  );
  if (!$socket) {
    throw new RuntimeException("SMTP connect failed: {$errstr}");
  }
  stream_set_timeout($socket, 20);

  $expect = static function ($sock, array $codes) use (&$expect): string {
    $data = '';
    while (($line = fgets($sock, 515)) !== false) {
      $data .= $line;
      if (isset($line[3]) && $line[3] === ' ') {
        break;
      }
    }
    $code = (int)substr($data, 0, 3);
    if (!in_array($code, $codes, true)) {
      throw new RuntimeException('SMTP unexpected: ' . trim($data));
    }
    return $data;
  };
  $cmd = static function ($sock, string $line, array $codes) use ($expect): void {
    fwrite($sock, $line . "\r\n");
    $expect($sock, $codes);
  };

  $expect($socket, [220]);
  $cmd($socket, 'EHLO nic-ecolog.ru', [250]);
  $cmd($socket, 'AUTH LOGIN', [334]);
  $cmd($socket, base64_encode($cfg['smtp_user']), [334]);
  $cmd($socket, base64_encode($cfg['smtp_pass']), [235]);

  $from = $cfg['mail_from'];
  $to = $cfg['mail_to'];
  $cmd($socket, 'MAIL FROM:<' . $from . '>', [250]);
  $cmd($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
  $cmd($socket, 'DATA', [354]);

  $fromName = encode_header($cfg['mail_from_name']);
  $headers = [
    'Date: ' . date('r'),
    'From: ' . $fromName . ' <' . $from . '>',
    'To: <' . $to . '>',
    'Subject: ' . encode_header($subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    'Reply-To: ' . $replyTo,
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@nic-ecolog.ru>',
  ];
  $payload = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body)) . "\r\n.";
  $cmd($socket, $payload, [250]);
  $cmd($socket, 'QUIT', [221]);
  fclose($socket);
}

function encode_header(string $value): string
{
  return '=?UTF-8?B?' . base64_encode($value) . '?=';
}
