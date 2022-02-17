import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MQTT, { AsyncMqttClient } from "async-mqtt";
import {CircularProgressbar} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"


const MQTT_BROKER_URL = "ws://18.162.55.224:9001"
let mqtt_client:any;


function App() {
  const [lockInfo, setLockInfo] = useState<String>("");
  const [harnessInfo, setHarnessInfo] = useState<String>("");

  useEffect(()=>{
    const connectMQTT = async () => {
      mqtt_client = await MQTT.connectAsync(MQTT_BROKER_URL);
      console.log('mqtt connected')
      mqtt_client.subscribe("/+")
      console.log('mqtt subscribed')
      getMQTT();
    }
    connectMQTT();
  }, [])
  
  const getMQTT = () => {
    try{
      console.log('mqtt on')
      mqtt_client.on("message",(topic:any, payload:any) => {
        switch(topic){
          case "/lock":
            try{
              console.log("lock")
              console.log(payload.toString())
              setLockInfo(payload.toString());
            }catch(e){
              console.log(e)
            }
            break;
          case "/harness":
            try{
              console.log("harness")
              console.log(payload)
              setHarnessInfo(payload.toString());
            }catch(e){
              console.log(e)
            }
            break;
          default:
            console.log("none")
        }
      })
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        <div>Lock Info: {lockInfo}</div>
        <div>Harness Info: {harnessInfo}</div>
        <div style={{width:200, height:200}}>
          <CircularProgressbar
            value={10}
            text={"sad"}      
            circleRatio={1}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
