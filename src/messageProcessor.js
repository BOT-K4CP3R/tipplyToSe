const { sendToStreamElements } = require('./streamElements');

function processTipMessage(message) {
  try {
    const jsonStart = message.indexOf('[');
    if (jsonStart === -1) return;
    
    const jsonData = message.substring(jsonStart);
    const tipData = JSON.parse(jsonData);
    
    if (tipData[0] === 'tip') {
      const tip = JSON.parse(tipData[1]);
      
      const plainTextMessage = formatMessageWithEmotes(tip.message);

      sendToStreamElements({
        ...tip,
        message: plainTextMessage
      });
    }
  } catch (error) {
    console.error('Błąd przetwarzania wiadomości:', error);
  }
}

function formatMessageWithEmotes(message) {
  if (!message) return '';
  
  return message.replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, function(match, altText) {
    return altText;
  });
}

module.exports = {
  processTipMessage
};
