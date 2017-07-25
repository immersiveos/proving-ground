/** General Configurations Like PORT, HOST names and etc... */

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  // hardcoded bpublic registry - deployed by truffle deploy
  ballotsRegistryAddress: '0x12842e41527fb01afcb23f89a73aa4260b7eb2d5',

  // sandard token used for testing
  immersiveTokenAddress: '0x7004dd1e3f4ecdd4ea2c657f07b0ed04014aa067',

  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      title: 'The Proving Ground',
      titleTemplate: 'The Proving Ground - %s',
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'React Redux Typescript' },
      ]
    }
  }
};

module.exports = config;
