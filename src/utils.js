function extractSid(response) {
  try {
    const jsonStartIndex = response.indexOf('{');
    if (jsonStartIndex === -1) return null;
    
    const jsonEndIndex = response.indexOf('}', jsonStartIndex) + 1;
    const jsonStr = response.substring(jsonStartIndex, jsonEndIndex);
    
    const data = JSON.parse(jsonStr);
    return data.sid;
  } catch (error) {
    return null;
  }
}

function generateTimestamp() {
  return `PQd${Math.random().toString(36).substring(2, 6)}`;
}

module.exports = {
  extractSid,
  generateTimestamp
};
