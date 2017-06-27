/** General Configurations Like PORT, HOST names and etc... */

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  // token contract address
  tokenAddress: '0xaEf034Fe7a5ECB37F8C362735CECAED4b0dD1F63',
  tokenSymbol: 'IMM',

  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      title: 'xxxxx',
      titleTemplate: 'xxxxx: %s',
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
