import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MQTT, { AsyncMqttClient } from "async-mqtt";
// import {CircularProgressbar} from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
import MpuStatusPanel from "./components/MpuStatusPanel"
import HarnessStatusPanel from './components/HarnessStatusPanel';


import { IMpuData, IMpuLockDataInitial, IMpuHarnessDataInitial } from './interface';


const MQTT_BROKER_URL = "ws://18.162.55.224:9001"
let mqtt_client:any;
// let mqtt_client_lock:any;
// let mqtt_client_harness:any;


function App() {
  const [mpuLockData, setMpuLockData] = useState<IMpuData>(IMpuLockDataInitial);
  const [mpuHarnessData, setMpuHarnessData] = useState<IMpuData>(IMpuHarnessDataInitial);
  const [directionLock, setDirectionLock] = useState<number>(0)
  const [directionHarness, setDirectionHarness] = useState<number>(0)
  const [stableLock, setStableLock] = useState<boolean>(false)
  const [stableHarness, setStableHarness] = useState<boolean>(false)
  const [harnessStatus, setHarnessStatus] = useState<number>(0)
  const [twoUp, setTwoUp] = useState<boolean>(false)
  useEffect(()=>{
    const connectMQTT = async () => {
      mqtt_client = await MQTT.connectAsync(MQTT_BROKER_URL);
      // mqtt_client.subscribe("/lock_harness")
      mqtt_client.subscribe("/direction/+")
      mqtt_client.subscribe("/stable/+")
      console.log("subscribed")
      // mqtt_client_lock = await MQTT.connectAsync(MQTT_BROKER_URL);
      // mqtt_client_lock.subscribe("/lock")
      // mqtt_client_harness = await MQTT.connectAsync(MQTT_BROKER_URL);
      // mqtt_client_harness.subscribe("/harness")
      onMessageMQTT();
    }
    connectMQTT();
  }, [])

  useEffect(()=>{
    if(directionLock==1){
      if(stableLock&&!stableHarness){
        setHarnessStatus(2); // Locked
      }else if(!stableLock){
        if(directionHarness==1){
          setHarnessStatus(1); // Hanged on Person
        }else{
          setHarnessStatus(0);
        }
      }
    }else{
      setHarnessStatus(0); // Unlocked
    }
  },[directionLock, directionHarness, stableLock, stableHarness])
  
  const onMessageMQTT = () => {
    try{
      mqtt_client.on("message",(topic:any, payload:any) => {
        console.log(topic)
        switch(topic){
          case "/direction/lock":
            setDirectionLock(Number(payload));
            break;
          case "/direction/harness":
            setDirectionHarness(Number(payload));
            break;
          case "/stable/lock":
            setStableLock(Number(payload)==1?true:false);
            break;
          case "/stable/harness":
            setStableHarness(Number(payload)==1?true:false);
            break;
        }
      })
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        {/* <MpuStatusPanelLock mpuData={mpuLockData.mpuData} /> */}
        {/* <MpuStatusPlanePanelLock mpuData={mpuLockData.mpuData} />
        <MpuStatusPlanePanelHarness mpuData={mpuHarnessData.mpuData} /> */}
        {/* <div>Lock: {mpuLockData.mpuData.acc_x},{mpuLockData.mpuData.acc_y},{mpuLockData.mpuData.acc_z}</div> */}
        {/* <div>Harness: {mpuHarnessData.mpuData.acc_x},{mpuHarnessData.mpuData.acc_y},{mpuHarnessData.mpuData.acc_z}</div> */}
        {/* <div>Lock Direction: {directionLock}</div> */}
        {/* <div>Harness Direction: {directionHarness}</div> */}
        {/* <div>onLocked: {twoUp.toString()}</div> */}
        <HarnessStatusPanel connected={true} statusId={harnessStatus} />
        <MpuStatusPanel mpu="Lock" connected={true} direction={directionLock} stable={stableLock} />
        <MpuStatusPanel mpu="Harness" connected={true} direction={directionHarness} stable={stableHarness} />
      </div>
    </div>
  );
}

export default App;
