/** General Configurations Like PORT, HOST names and etc... */

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  ballotsRegistryAddress: '0xe3c5ac0a2d068bd2353119f959e284e3839e9e4a',

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
