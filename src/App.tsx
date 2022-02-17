import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MQTT, { AsyncMqttClient } from "async-mqtt";
// import {CircularProgressbar} from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
import MpuStatusPanel from "./components/MpuStatusPanel"
import { IMpuData, IMpuLockDataInitial, IMpuHarnessDataInitial } from './interface';
import { CircularProgressbar } from 'react-circular-progressbar';


const MQTT_BROKER_URL = "ws://18.162.55.224:9001"
let mqtt_client:any;


function App() {
  const [lockInfo, setLockInfo] = useState<String>("");
  const [harnessInfo, setHarnessInfo] = useState<String>("");
  const [mpuLockData, setMpuLockData] = useState<IMpuData>(IMpuLockDataInitial);
  const [mpuHarnessData, setMpuHarnessData] = useState<IMpuData>(IMpuHarnessDataInitial);

  useEffect(()=>{
    const connectMQTT = async () => {
      mqtt_client = await MQTT.connectAsync(MQTT_BROKER_URL);
      console.log('mqtt connected')
      mqtt_client.subscribe("/+")
      console.log('mqtt subscribed')
      onMessageMQTT();
    }
    connectMQTT();
  }, [])
  
  const onMessageMQTT = () => {
    try{
      console.log('mqtt on')
      mqtt_client.on("message",(topic:any, payload:any) => {
        let payloadArray = payload.toString().split(", ")
        console.log(topic)
        switch(topic){
          case "/lock":
            try{
              setLockInfo(payload.toString());
              setMpuLockData({mpuData:{name:topic.replace('/',''), acc_x: payloadArray[0], acc_y: payloadArray[1], acc_z: payloadArray[2]}})
            }catch(e){
              console.log(e)
            }
            break;
          case "/harness":
            try{
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
        <MpuStatusPanel mpuData={mpuLockData.mpuData} />
        <MpuStatusPanel mpuData={mpuHarnessData.mpuData} />
      </div>
    </div>
  );
}

export default App;
