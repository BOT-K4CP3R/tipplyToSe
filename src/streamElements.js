const axios = require('axios');
const config = require('./config');

async function sendToStreamElements(tip) {
  const { channelId, apiToken, currency } = config.streamElements;

  try {
    const message = tip.message ? tip.message.substring(0, 250) : '';
    
    console.log('wysyłanie dono do se:', {
      od: tip.nickname,
      kwota: (tip.amount/100).toFixed(2),
      wiadomość: message
    });
    
    const options = {
      method: 'POST',
      url: `https://api.streamelements.com/kappa/v2/tips/${channelId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8, application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      data: {
        user: {
          userId: tip.id || '',
          username: tip.nickname || 'Anonymous',
          email: tip.email || 'anonymous@tipply.pl'
        },
        provider: 'tipply',
        message: message,
        amount: parseFloat((tip.amount/100).toFixed(2)),
        currency: currency || 'PLN',
        imported: true
      }
    };

    const response = await axios.request(options);
    
    if (response.data && response.status >= 200 && response.status < 300) {
      console.log('dono przesłane na se');
    } else {
      console.error('błąd api se:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('błąd wysyłania dono do se:');
    if (error.response) {
      console.error(`status: ${error.response.status}`);
      console.error('res:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

module.exports = {
  sendToStreamElements
};
