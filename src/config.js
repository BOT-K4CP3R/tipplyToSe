const https = require('https');

module.exports = {
  tipply: {
    userId: process.env.TIPPLY_USER_ID,
    mainWsUrl: 'https://ws.tipply.pl/socket.io/',
    alertWsUrl: 'https://alert-ws.tipply.pl/socket.io/'
  },
  
  streamElements: {
    channelId: process.env.SE_CHANNEL_ID,
    apiToken: process.env.SE_JWT_TOKEN,
    currency: process.env.SE_CURRENCY || 'PLN'
  },
  
  http: {
    headers: {
      "accept": "*/*",
      "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "Referer": "https://widgets.tipply.pl/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  },
  
  webSocket: {
    reconnectAttempts: 10,
    pingInterval: 25000
  }
};
