export default {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          removeViewBox: false,
        },
      },
    },
    {
      name: 'prefixIds',
      params: { prefix: 'eco-lab-' },
    },
    {
      name: 'removeDimensions',
    },
  ],
};
