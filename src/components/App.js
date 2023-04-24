import React, { useState, useEffect } from 'react';
import { defaultRange, defaultTarget } from '../config/defaults'

export const  App= props => {
  const {commandRobot , target} = props
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = function () {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = function (event) {
      setMessage(event.data);
      
    };

    return () => {
      ws.send("Close Socket");
      socket.close();
      
    };
  }, []);

  function sendMessage() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(target));
      console.log("websocket send!!");
    }
    else console.log("websocket send Failed!!")
  }


  function CheckEvent() {
    const ParseData = JSON.parse(message);
    ParseData.L0 += 199; 
    commandRobot(ParseData,0);
  }

  return (
    <div>
      <div>Received message: {message}</div>
      {ws && (
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
        <button onClick={CheckEvent}>CheckEvent</button>
      </div>
      )}
    </div>
  );
}

export default App;