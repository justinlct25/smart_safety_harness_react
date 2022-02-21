import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MQTT, { AsyncMqttClient } from "async-mqtt";
// import {CircularProgressbar} from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
import MpuStatusPanel from "./components/MpuStatusPanel"
import SafetyHarnessStatusPanel from './components/SafetyHarnessStatusPanel';
import './styles.css'


import { IMpuData, IMpuLockDataInitial, IMpuHarnessDataInitial } from './interface';


const MQTT_BROKER_URL = "ws://18.162.55.224:9001"
let mqtt_client:any;

function App() {
  const [connectedLock, setConnectedLock] = useState<boolean>(false)
  const [connectedHarness, setConnectedHarness] = useState<boolean>(false)
  const [directionLock, setDirectionLock] = useState<number>(0)
  const [directionHarness, setDirectionHarness] = useState<number>(0)
  const [stableLock, setStableLock] = useState<boolean>(false)
  const [stableHarness, setStableHarness] = useState<boolean>(false)
  const [safetyHarnessStatus, setSafetyHarnessStatus] = useState<number>(0)
  const [lockStatusArray, setLockStatusArray] = useState<any>([])
  const [harnessStatusArray, setHarnessStatusArray] = useState<any>([])
  const [tempStableLock, setTempStableLock] = useState<boolean>(false)

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

  const D1_STABLE_STATUS = { // direction 1 of mpus
    "NOTD1": "NOTD1",
    "MOVE": "MOVE",
    "STABLE": "STABLE",
    "LOCKED": "LOCKED"
  }
  const SYNC_ARRAY_LENGTH = 10

  let lockCheckTimeout:any;

  const setCheckStableLockTimeout = () => {
    lockCheckTimeout = !lockCheckTimeout && setTimeout(() => {
      if(tempStableLock){
        setSafetyHarnessStatus(2);                                              // Status: Locked
      }
      setTempStableLock(false);
    }, 3000)
  }

  useEffect(()=>{
    // if(directionLock == 1){
    //   if(stableLock && !stableHarness){ 
    //     setSafetyHarnessStatus(2); // Locked
    //   }else if(!stableLock){
    //     if(directionHarness == 1){
    //       setSafetyHarnessStatus(1); // Hanged on Person
    //     }else{
    //       setSafetyHarnessStatus(0); // Unlocked
    //     }
    //   }
    // }else{
    //   setSafetyHarnessStatus(0); // Unlocked
    // }
    if(directionLock == 1){                 // lock vertical direction
      if(stableLock && !stableHarness){     // lock stable & harness moved
        setTempStableLock(true);
        // setSafetyHarnessStatus(2);                                              // Status: Locked
        setCheckStableLockTimeout();
      }else if(!stableLock){                // lock moved
        setTempStableLock(false);
        setSafetyHarnessStatus(0);                                              // Status: Unlocked
        clearTimeout(lockCheckTimeout);
      }
    }else{                                  // harness 
      setTempStableLock(false);
      setSafetyHarnessStatus(0); // Unlocked
      clearTimeout(lockCheckTimeout);
    }
  },[directionLock, directionHarness, stableLock, stableHarness])


  const updateMpuSyncArray = () => {
    switch(safetyHarnessStatus){
      case 0: // Unlocked
      case 1: // Hanged on Person
        switch(directionLock){
          case 1: // direction is 1 (up)
            if(lockStatusArray.length >= SYNC_ARRAY_LENGTH){
              setLockStatusArray((array: any) => array.slice(1))
            }
            setLockStatusArray((array: any) => [...array, stableLock?D1_STABLE_STATUS["STABLE"]:D1_STABLE_STATUS["MOVE"]])
            break;
          default:
            if(lockStatusArray.length >= SYNC_ARRAY_LENGTH){
              setLockStatusArray((array: any) => array.slice(1))
            }
            setLockStatusArray((array: any) => [...array, D1_STABLE_STATUS["NOTD1"]])
        }
        switch(directionHarness){
          case 1: // direction is 1 (up)
            if(harnessStatusArray.length >= SYNC_ARRAY_LENGTH){
              setHarnessStatusArray((array: any) => array.slice(1))
            }
            setHarnessStatusArray((array: any) => [...array, stableHarness?D1_STABLE_STATUS["STABLE"]:D1_STABLE_STATUS["MOVE"]])
            break;
          default:
            if(harnessStatusArray.length >= SYNC_ARRAY_LENGTH){
              setHarnessStatusArray((array: any) => array.slice(1))
            }
            setHarnessStatusArray((array: any) => [...array, D1_STABLE_STATUS["NOTD1"]])
        }
        break;
      case 2: // Locked
        if(harnessStatusArray.length >= SYNC_ARRAY_LENGTH){
          setHarnessStatusArray((array: any) => array.slice(1))
        }
        setHarnessStatusArray((array: any) => [...array, D1_STABLE_STATUS["LOCKED"]])
        break;
    }
    console.log("lock & harness array")
    console.log(lockStatusArray);
    console.log(harnessStatusArray);
  }

  const calculateSyncPercentage = () => {
    let sync_count = 0;
    let move_count = 0;
    for (let i=0; i<SYNC_ARRAY_LENGTH; i++){
      if(lockStatusArray[i]){
        if((lockStatusArray[i]!=D1_STABLE_STATUS["NOTD1"]&&harnessStatusArray[i]!=D1_STABLE_STATUS["NOTD1"])&&(lockStatusArray[i]!=D1_STABLE_STATUS["LOCKED"]||harnessStatusArray[i]!=D1_STABLE_STATUS["LOCKED"])){
          if(lockStatusArray[i]==harnessStatusArray[i]){
            if(lockStatusArray[i]==D1_STABLE_STATUS["MOVE"]){
              move_count++;
            }
            sync_count++;
          }
        }
      }
    }
    let sync_ratio = sync_count/SYNC_ARRAY_LENGTH;
    let move_ratio = move_count/SYNC_ARRAY_LENGTH;
    console.log("sync & move ratio")
    console.log(sync_ratio)
    console.log(move_ratio)
    if (sync_ratio > 0.7 && move_ratio > 0.2){
      if (safetyHarnessStatus == 0){
        setSafetyHarnessStatus(1);
      }
    }
  }

  let syncInterval:any;

  const setUpdateMpuSyncArrayInterval = () => {
    syncInterval = !syncInterval && setInterval(() => {
      updateMpuSyncArray();
      calculateSyncPercentage();
    }, 1000)
  }

  useEffect(()=>{
    setUpdateMpuSyncArrayInterval()
    return () => clearInterval(syncInterval)
  })

  let lockConnectedTimeout: any;
  let harnessConnectedTimeout: any;

  const setLockConnectedTimeout = () => {
    lockConnectedTimeout = !lockConnectedTimeout && setTimeout(() => {
      setConnectedLock(false);
    },5000)
  }
  const setHarnessConnectedTimeout = () => {
    harnessConnectedTimeout = !harnessConnectedTimeout && setTimeout(() => {
      setConnectedHarness(false);
    },5000)
  }

  const updateLockConnectStatus = () => {
    setConnectedLock(true);
    clearTimeout(lockConnectedTimeout);
    setLockConnectedTimeout();
  }

  const updateHarnessConnectedStatus = () => {
    setConnectedHarness(true);
    clearTimeout(harnessConnectedTimeout);
    setHarnessConnectedTimeout();
  }
  
  const onMessageMQTT = () => {
    try{
      mqtt_client.on("message",(topic:any, payload:any) => {
        // console.log(topic)
        switch(topic){
          case "/direction/lock":
            setDirectionLock(Number(payload));
            updateLockConnectStatus();
            break;
          case "/direction/harness":
            setDirectionHarness(Number(payload));
            updateHarnessConnectedStatus();
            break;
          case "/stable/lock":
            setStableLock(Number(payload)==1?true:false);
            updateLockConnectStatus();
            break;
          case "/stable/harness":
            setStableHarness(Number(payload)==1?true:false);
            updateHarnessConnectedStatus();
            break;
        }
      })
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className="App">
      <div className="outerContainer">
        <div className="safetyPlatformInfoContainer">
          {/* <div className="personDetectionContainer"></div> */}
          <div className="safetyHarnessContainer">
            <div className="safetyHarnessInfo"></div>
            <div className="safetyHarness">
              <SafetyHarnessStatusPanel connected={connectedLock&&connectedHarness} statusId={safetyHarnessStatus} />
              <div className="mpuContainer">
                <MpuStatusPanel mpu="Lock" connected={connectedLock} direction={directionLock} stable={stableLock} />
                <MpuStatusPanel mpu="Harness" connected={connectedHarness} direction={directionHarness} stable={stableHarness} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
