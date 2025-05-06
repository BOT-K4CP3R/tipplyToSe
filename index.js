require('dotenv').config();
const { connectToServers } = require('./src/websocket');

connectToServers()
  .then(({ cleanup }) => {
    console.log('Połączono z serwerami Tipply');
    
    process.on('SIGINT', () => {
      cleanup();
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error('błąd połączenia:', error);
    process.exit(1);
  });
