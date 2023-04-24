import React, { useState, useEffect } from 'react'
import { defaultRange, defaultTarget } from '../config/defaults'
import { useSerial } from '../hooks/useSerialHook'
import { scaleAxes, constructTCodeCommand } from '../utils/tcode'


export const MosaContext = React.createContext({
  settings: defaultRange,
  target: defaultTarget,
  inputMethod: 'web',
})

export const MosaProvider = ({ children }) => {
  const isSerialAvailable =
    typeof window !== 'undefined' && 'serial' in navigator // https://github.com/gatsbyjs/gatsby/issues/6859

  const [mosaSettings, setMosaSettings] = useState(defaultRange)

  const [connectToSerial, disconnectFromSerial, writeToSerial] = useSerial()
  const [connected, setConnected] = useState(false)
  const [target, setTarget] = useState(defaultTarget)

  const [inputMethod, setSelectedInputMethod] = useState('web')
  const handleInputMethodChange = (event, newInputMethod) => {
    setSelectedInputMethod(newInputMethod)
  }

  const [outputMethod, setSelectedOutputMethod] = useState()
  const [message, setMessage] = useState('');

  const [ws, setWs] = useState(null);
  const sendMessage = async (destination, interval) => {
    const newTarget = { ...target, ...destination }
    setTarget(newTarget)
    ws.send(JSON.stringify(target));
  }
  useEffect(() => {
    const socket = new WebSocket('ws://http://118.36.247.42/:8080');
    //const socket = io('http://localhost:5000');
    setWs(socket);

    socket.onopen = function () {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = function (event) {
      const ParseData = JSON.parse(event.data);
      commandRobot(ParseData,0);
    };

    // socket.on('message', (data) => {
    //   setMessage(data);
    // });

    return () => {
      ws.send("Close Socket");
      socket.close();
      
    };
  }, []);
  
  const handleOutputMethodChange = async (event, newOutputMethod) => {
    // todo: make this better
    if (connected) {
      await handleDisconnectFromSerial() // eventually, all methods
      await handleDisconnectFromVisualization()
    }

    switch (newOutputMethod) {
      case null: // none selected or active is deselected
        console.log('[OSR][INFO] Disconnecting from outputs.')
        break
      case 'serial':
        handleConnectToSerial()
        break
      case 'visualizer':
        handleConnectToVisualization()
        break
      default:
        console.warn(
          '[OSR][WARN] Unknown output method selected: ' + newOutputMethod
        )
    }
    setSelectedOutputMethod(newOutputMethod)
  }

  const handleConnectToVisualization = async () => {
    console.log('[OSR][DEV] Connecting to SR Visualization')
    setConnected(true)
  }
  const handleDisconnectFromVisualization = async () => {
    console.log('[OSR][DEV] Disconnecting from SR Visualization')
    setConnected(false)
  }

  // once, on load, try to load settings from localStorage
  // if we can't find them, create them in localStorage
  useEffect(() => {
    // we can store strings, not objects, in localstorage
    const existingMosaSettings = JSON.parse(
      localStorage.getItem('mosaSettings')
    )
    if (existingMosaSettings) {
      setMosaSettings(existingMosaSettings)
    } else {
      setMosaSettings(defaultRange)
      // we can store strings, not objects, in localstorage
      localStorage.setItem('mosaSettings', JSON.stringify(defaultRange))
    }
  }, [setMosaSettings])

  const updateSettings = newSettings => {
    setMosaSettings(newSettings)
    localStorage.setItem('mosaSettings', JSON.stringify(newSettings))
  }

  const handleConnectToSerial = async () => {
    try {
      await connectToSerial()
      setConnected(true)
    } catch (e) {
      console.error(e)
      setConnected(false)
      setSelectedOutputMethod(null) // connecting failed :(
      // TODO: set error state, create/catch via error boundary?
    }
  }
  const handleDisconnectFromSerial = async () => {
    commandRobot(defaultTarget, 1, defaultRange)
    await disconnectFromSerial()
    setConnected(false)
  }

  const commandRobot = (destination, interval) => {
    // persist target to state //destination 축이름 //interval 크기 강도
    const newTarget = { ...target, ...destination }
    setTarget(newTarget)

    // tell the robot what to do
    const scaledDestination = scaleAxes(newTarget, mosaSettings)
    const command = constructTCodeCommand(scaledDestination, interval)
    switch (outputMethod) {
      case 'serial':
        writeToSerial(command)
        break
      case 'visualizer':
        console.log('[OSR][DEV] Output to vis: ' + command)
        break
      default:
        console.warn('[OSR][DEV] unknown output method - command: ' + command)
    }
  }

  return (
    <MosaContext.Provider
      value={{
        isSerialAvailable: isSerialAvailable,
        connected: connected,
        commandRobot: commandRobot,
        target: target,
        inputMethod: inputMethod,
        handleInputMethodChange,
        outputMethod: outputMethod,
        handleOutputMethodChange: handleOutputMethodChange,
        settings: mosaSettings,
        updateSettings: updateSettings,
        sendMessage:sendMessage,
        message:message
      }}
    >
      {children}
    </MosaContext.Provider>
  )
}
