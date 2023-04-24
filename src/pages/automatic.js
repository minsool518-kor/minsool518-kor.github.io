import React from 'react'
import Layout from '../components/layout'
import { Card, Typography, CardContent, Grid, Divider , Button} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { MosaContext } from '../context/MosaContext'
import MosaMotionControl from '../components/MosaComponents/MosaMotionControl'
import MosaVisualizer from '../components/MosaComponents/MosaVisualizer'


export default function Automatic() {
  return (
    <MosaContext.Consumer>
      {({
        isSerialAvailable,
            connected,
            commandRobot,
            target,
            inputMethod,
            handleInputMethodChange,
            outputMethod,
            handleOutputMethodChange,
            settings,
            updateSettings,
            sendMessage
      }) => (
        <Layout>
           <Grid container spacing={2} justify="center">
            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography>
                    Input: {!inputMethod && 'none selected'}
                  </Typography>
                  <ToggleButtonGroup
                    value={inputMethod}
                    exclusive
                    onChange={handleInputMethodChange}
                  >
                    <ToggleButton value="web">WEB</ToggleButton>
                    <ToggleButton value="remote" disabled>
                      REMOTE
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <br />
                  <br />
                  <Typography>
                    Output: {!outputMethod && 'none selected'}
                  </Typography>
                  <ToggleButtonGroup
                    value={outputMethod}
                    exclusive
                    onChange={handleOutputMethodChange}
                  >
                    {isSerialAvailable && (
                      <ToggleButton value="serial">SERIAL</ToggleButton>
                    )}
                    <ToggleButton value="visualizer">SR-VIS</ToggleButton>
                  </ToggleButtonGroup>
                </CardContent>
              </Card>
              <hr />
              <MosaVisualizer target={target} />
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
              <MosaMotionControl
                connected={!connected}
                target={target}
                commandRobot={commandRobot}
                Hide={true}
                sendMessage={sendMessage}
              />
            </Grid>        
            <Grid item xs={12} md={4} lg={4}>
            
            <div>Received message: {JSON.stringify(target)}</div>
            <Button onClick={() => {
              const commed = {};
              commed['L0'] = 100;
              sendMessage(commed,0);
              }}>L0/100</Button>
            </Grid>
                
            
          </Grid>
          &nbsp;
          <Divider />
        </Layout>
    )}
    </MosaContext.Consumer>
  );
}
