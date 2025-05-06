const WebSocket = require('ws');
const config = require('./config');
const { extractSid, generateTimestamp } = require('./utils');
const { processTipMessage } = require('./messageProcessor');

/**
 * Create a WebSocket connection with auto-reconnect
 */
function createWebSocketWithReconnect(url, options, messageHandler, name) {
  let ws = new WebSocket(url, options);
  let reconnectAttempt = 0;
  let heartbeatInterval = null;
  
  function setupEventHandlers() {
    ws.on('open', () => {
      console.log(`${name} WebSocket połączony`);
      reconnectAttempt = 0;
      ws.send('2probe');
      
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      
      heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('2');
        }
      }, config.webSocket.pingInterval);
    });
    
    ws.on('message', (data) => {
      const message = data.toString();
      
      if (message === '3probe') {
        ws.send('5');
      } else if (message === '2') {
        ws.send('3');
      } else {
        messageHandler(message);
      }
    });
    
    ws.on('error', () => {});
    
    ws.on('close', () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      
      if (reconnectAttempt < config.webSocket.reconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
        reconnectAttempt++;
        
        setTimeout(() => {
          ws = new WebSocket(url, options);
          setupEventHandlers();
        }, delay);
      }
    });
  }
  
  setupEventHandlers();
  
  return {
    socket: ws,
    cleanup: () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
  };
}

async function connectToServers() {
  const { userId } = config.tipply;
  const { headers, agent } = config.http;
  
  try {
    const mainResponse = await fetch(`${config.tipply.mainWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}`, {
      method: "GET",
      headers: {
        ...headers
      },
      agent
    });
    
    const mainText = await mainResponse.text();
    const mainSid = extractSid(mainText);
    
    if (!mainSid) throw new Error("Nie udało się uzyskać main SID");
    
    const alertResponse = await fetch(`${config.tipply.alertWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}`, {
      method: "GET",
      headers: {
        ...headers
      },
      agent
    });
    
    const alertText = await alertResponse.text();
    const alertSid = extractSid(alertText);
    
    if (!alertSid) throw new Error("Nie udało się uzyskać alert SID");
    
    await fetch(`${config.tipply.alertWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}&sid=${alertSid}`, {
      method: "POST",
      headers: {
        ...headers,
        "content-type": "text/plain;charset=UTF-8",
        "cookie": `io=${alertSid}`
      },
      body: `40:40/${userId},`,
      agent
    });
    
    await fetch(`${config.tipply.alertWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}&sid=${alertSid}`, {
      method: "GET",
      headers: {
        ...headers,
        "cookie": `io=${alertSid}`
      },
      agent
    });
    
    await fetch(`${config.tipply.mainWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}&sid=${mainSid}`, {
      method: "POST",
      headers: {
        ...headers,
        "content-type": "text/plain;charset=UTF-8",
        "cookie": `io=${mainSid}`
      },
      body: `44:40/tip/${userId},`,
      agent
    });
    
    await fetch(`${config.tipply.mainWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}&sid=${mainSid}`, {
      method: "GET",
      headers: {
        ...headers,
        "cookie": `io=${mainSid}`
      },
      agent
    });
    
    const channelsBody = `49:40/template/${userId},54:40/configuration/${userId},46:40/goals/${userId},47:40/voting/${userId},55:40/countdown_time/${userId},49:40/commands/${userId},`;
    
    await fetch(`${config.tipply.mainWsUrl}?EIO=3&transport=polling&t=${generateTimestamp()}&sid=${mainSid}`, {
      method: "POST",
      headers: {
        ...headers,
        "content-type": "text/plain;charset=UTF-8", 
        "cookie": `io=${mainSid}`
      },
      body: channelsBody,
      agent
    });
    
    const mainWsConnection = createWebSocketWithReconnect(
      `wss://ws.tipply.pl/socket.io/?EIO=3&transport=websocket&sid=${mainSid}`,
      {
        headers: {
          "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "pragma": "no-cache"
        },
        rejectUnauthorized: false
      },
      (message) => {
        if (message.startsWith('42/tip/')) {
          processTipMessage(message);
        }
      },
      'Main'
    );
    
    return { 
      mainWs: mainWsConnection.socket, 
      cleanup: () => {
        mainWsConnection.cleanup();
      }
    };
  } catch (error) {
    console.error('błąd:', error);
    throw error;
  }
}

module.exports = {
  connectToServers
};
