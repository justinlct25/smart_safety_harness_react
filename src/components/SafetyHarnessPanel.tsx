import React, { useEffect, useState, useRef } from 'react'
import MQTT, { AsyncMqttClient } from "async-mqtt";
import MpuStatus from "./MpuStatus";
import SafetyHarnessStatus from './SafetyHarnessStatus';
import '../styles.css'
import lockedPng from '../media/locked.png'
import hangedPng from '../media/hanged.png'
import unlockedPng from '../media/unlocked.png'
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"


const MQTT_BROKER_URL = "ws://18.162.55.224:9001"
let mqtt_client:any;

export const SAFETY_HARNESS_STATUS = {
    "UNLOCKED": 0,
    "HANGED": 1,
    "LOCKED": 2
  }
  
  export const D1_STABLE_STATUS = { // direction 1 of mpus
    "NOTD1": "NOTD1",
    "MOVE": "MOVE",
    "STABLE": "STABLE",
    "LOCKED": "LOCKED"
  }

  const HarnessStatus:any = {
    0: "Unlocked",
    1: "Hanged on Person",
    2: "Locked",
}

const SafetyHarnessPanel = () => {
    const [connectedLock, setConnectedLock] = useState<boolean>(false)
    const [connectedHarness, setConnectedHarness] = useState<boolean>(false)
    const [directionLock, setDirectionLock] = useState<number>(0)
    const [directionHarness, setDirectionHarness] = useState<number>(0)
    const [stableLock, setStableLock] = useState<boolean>(false)
    const [stableHarness, setStableHarness] = useState<boolean>(false)
    const [safetyHarnessStatus, setSafetyHarnessStatus] = useState<number>(0)
    const [lockStatusArray, setLockStatusArray] = useState<any>([])
    const [harnessStatusArray, setHarnessStatusArray] = useState<any>([])
    const [lockStatusTimeoutExist, setLockStatusTimeoutExist] = useState<boolean>(false)
    const [cancelHangedStatusByDirectionTimeoutExist, setCancelHangedStatusByDirectionTimeoutExist] = useState<boolean>(false)
    const [cancelHangedStatusBySyncRatioTimeoutExist, setCancelHangedStatusBySyncRatioTimeoutExist] = useState<boolean>(false)
    const [lockedStatusCountdown, setLockedStatusCountdown] = useState<number>(0)
    const [lockedStatusCountdownRatio, setLockedStatusCountdownRatio] = useState<number>(0)
    const [hangedStatusSyncRatio, setHangedStatusSyncRatio] = useState<number>(0)
    const [hangedStatusMoveRatio, setHangedStatusMoveRatio] = useState<number>(0)
    const [syncIdleCountdown, setSyncIdleCountdown] = useState<number>(0)

    const setLockStatusTimeoutRef:any = useRef(null);
    const setLockStatusIntervalRef:any = useRef(null);
    const setLockStatusSecIntervalRef:any = useRef(null);
    const cancelHangedStatusByDirectionTimeoutRef:any = useRef(null);
    const cancelHangedStatusBySyncRatioTimeoutRef:any = useRef(null);
  
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
    
    const SYNC_ARRAY_LENGTH = 10
  
    const setLockStatusTimeout = (time:number) => {
    //   lockCheckTimeout = !lockCheckTimeout && setTimeout(() => {
      let ratioPerCountdown = 500/time
      if(safetyHarnessStatus!=SAFETY_HARNESS_STATUS["LOCKED"]){
        setLockedStatusCountdownRatio(0)
        setLockedStatusCountdown(3)
      }
      setLockStatusIntervalRef.current = setInterval(() => {
        setLockedStatusCountdownRatio(ratio => (ratio + ratioPerCountdown))
      },500)
      setLockStatusSecIntervalRef.current = setInterval(() => {
        setLockedStatusCountdown(sec => (sec - 1))
      },1000)
        setLockStatusTimeoutRef.current = setTimeout(() => {
            setSafetyHarnessStatus(SAFETY_HARNESS_STATUS["LOCKED"]);                                              // Status: Locked
            setLockStatusTimeoutExist(false)
            clearCancelHangedStatusByDirectionTimeout("");
            clearInterval(setLockStatusIntervalRef.current)
            clearInterval(setLockStatusSecIntervalRef.current)
            setLockedStatusCountdown(3)
            }, time)
        setLockStatusTimeoutExist(true)
    }
  
    const clearLockStatusTimeout = (reason: string) => {
        // console.log(reason)
        clearTimeout(setLockStatusTimeoutRef.current);
        clearInterval(setLockStatusIntervalRef.current)
        clearInterval(setLockStatusSecIntervalRef.current)
        setLockStatusTimeoutExist(false)
        if(safetyHarnessStatus!=SAFETY_HARNESS_STATUS["LOCKED"]){
          setLockedStatusCountdownRatio(0)
          setLockedStatusCountdown(3)
        }
    }

    const setCancelHangedStatusByDirectionTimeout = (time: number) => {
        cancelHangedStatusByDirectionTimeoutRef.current = setTimeout(() => {
            if(safetyHarnessStatus == SAFETY_HARNESS_STATUS["HANGED"]){
                setSafetyHarnessStatus(SAFETY_HARNESS_STATUS["UNLOCKED"])
            }
            setCancelHangedStatusByDirectionTimeoutExist(false)
        }, time)
        setCancelHangedStatusByDirectionTimeoutExist(true)
    } 

    const clearCancelHangedStatusByDirectionTimeout = (reason: string) => {
        clearTimeout(cancelHangedStatusByDirectionTimeoutRef.current);
        setCancelHangedStatusByDirectionTimeoutExist(false)
    }

    const setCancelHangedStatusBySyncRatioTimeout = (time: number) => {
        cancelHangedStatusBySyncRatioTimeoutRef.current = setTimeout(() => {
            if(safetyHarnessStatus == SAFETY_HARNESS_STATUS["HANGED"]){
                setSafetyHarnessStatus(SAFETY_HARNESS_STATUS["UNLOCKED"])
            }
            setCancelHangedStatusBySyncRatioTimeoutExist(false)
        }, time)
        setCancelHangedStatusBySyncRatioTimeoutExist(true)
    } 

    const clearCancelHangedStatusBySyncRatioTimeout = (reason: string) => {
        clearTimeout(cancelHangedStatusBySyncRatioTimeoutRef.current);
        setCancelHangedStatusBySyncRatioTimeoutExist(false)
    }

  
    useEffect(()=>{
      if(directionLock == 1){                 // lock vertical direction
        if(stableLock && !stableHarness){     // lock stable & harness moved
          if(safetyHarnessStatus != SAFETY_HARNESS_STATUS["LOCKED"]){
                if(!lockStatusTimeoutExist){
                    setLockStatusTimeout(3000);    // ensure lock not move, harness not stable & lock vertical within 3 secs
                }
          }
        }else if(!stableLock){                // lock moved
          if(safetyHarnessStatus != SAFETY_HARNESS_STATUS["HANGED"] ){ 
            setSafetyHarnessStatus(SAFETY_HARNESS_STATUS["UNLOCKED"]);                                              // Status: Unlocked
            setLockedStatusCountdownRatio(0);
            setLockedStatusCountdown(3)
          }
          clearLockStatusTimeout("clear set locked timeout(!stableLock)");
        }
        if(stableHarness){                  // harness moved
                clearLockStatusTimeout("clear timeout (stableHarness)")
        }
      }else{                                  // harness 
        if(safetyHarnessStatus == SAFETY_HARNESS_STATUS["LOCKED"]){
          setSafetyHarnessStatus(SAFETY_HARNESS_STATUS["UNLOCKED"]); // Unlocked
          setLockedStatusCountdownRatio(0);
          setLockedStatusCountdown(3);
        }
        clearLockStatusTimeout("clear set locked timeout (directionLock!=1)")
      }
      if(directionLock==1 && directionHarness==1){ // for determining hanged on person status
              clearCancelHangedStatusByDirectionTimeout("");
      }else{
          if(safetyHarnessStatus == SAFETY_HARNESS_STATUS["HANGED"]){
              if(!cancelHangedStatusByDirectionTimeoutExist){
                  setCancelHangedStatusByDirectionTimeout(2000);
              }
          }
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
    //   console.log("lock & harness d1 array")
    //   console.log(lockStatusArray);
    //   console.log(harnessStatusArray);
    }
  
    const determineHangOnPerson = () => {
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
      // if(syncIdleCountdown==0 && move_count==0){
      //   setSyncIdleCountdown(SYNC_ARRAY_LENGTH)
      // }
      // console.log(syncIdleCountdown)
      let sync_ratio = sync_count/SYNC_ARRAY_LENGTH;
      let move_ratio = move_count/SYNC_ARRAY_LENGTH;
      setHangedStatusSyncRatio(sync_ratio);
      setHangedStatusMoveRatio(move_ratio);
    //   console.log("sync & move ratio")
      // console.log(sync_ratio)
    //   console.log(move_ratio)
      if (sync_ratio > 0.6 && move_ratio > 0.1){
        if (safetyHarnessStatus == SAFETY_HARNESS_STATUS["UNLOCKED"]){
          setSafetyHarnessStatus(SAFETY_HARNESS_STATUS["HANGED"]);
        }
        clearCancelHangedStatusBySyncRatioTimeout("");
      }
      if(sync_ratio <=0.6){
          if (safetyHarnessStatus == SAFETY_HARNESS_STATUS["HANGED"]){
              if(!cancelHangedStatusBySyncRatioTimeoutExist){
                  setCancelHangedStatusBySyncRatioTimeout(2000)
              }
          }
      }
    }

    let syncInterval: any;
  
    const setUpdateMpuSyncArrayInterval = () => {
      syncInterval = !syncInterval && setInterval(() => {
        //   updateStableArray();
        updateMpuSyncArray();
        determineHangOnPerson();
      }, 500)
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
        //   console.log(topic)
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
        <div className="safetyHarnessContainer">
            <div className="safetyHarnessInfo"><b>Safety Harness Status</b></div>
              <div className="safetyHarnessFlex">
                <div className="safetyHarness" >
                {/* <div className={!(connectedLock||connectedHarness)?"safetyHarnessDisconnected":
                                safetyHarnessStatus==SAFETY_HARNESS_STATUS["UNLOCKED"]?"safetyHarnessUnlocked":
                                safetyHarnessStatus==SAFETY_HARNESS_STATUS["HANGED"]?"safetyHarnessHanged":
                                "safetyHarnessLocked"}> */}
                    <div className="safetyHarnessFlex">
                        <SafetyHarnessStatus mpuNo={1} mpuId={"LA-EP02-01"} connected={connectedLock&&connectedHarness} statusId={safetyHarnessStatus} idle={stableLock&&stableHarness} />
                    </div>
                    <div className={safetyHarnessStatus==1?"harnessStatusHanged":safetyHarnessStatus==2?"harnessStatusLocked":"harnessStatusUnlocked"}>
                        <b>{connectedLock&&connectedHarness?HarnessStatus[safetyHarnessStatus]:"Disconnected"}</b>
                    </div>
                    <div className="safetyHarnessStatus">
                      <div className="circularContainer">
                        <CircularProgressbarWithChildren
                          value={safetyHarnessStatus!=SAFETY_HARNESS_STATUS["HANGED"]?(hangedStatusMoveRatio!=0?hangedStatusSyncRatio*100*(100/60):0):hangedStatusSyncRatio*100*(100/60)}
                          // text={"test"}
                          strokeWidth={3.5}
                          styles={buildStyles({
                            pathColor: "rgba(206,144,0,0.9)",
                            trailColor:"rgba(255,0,0,0.5)",
                            // strokeLinecap: "butt"
                          })}>
                          <CircularProgressbar
                            value={lockedStatusCountdownRatio*100}
                            // text={"test"}
                            strokeWidth={3.5}
                            styles={buildStyles({
                              pathColor: "rgba(60,255,20,0.6)",
                              trailColor:"transparent",
                              // strokeLinecap: "butt"
                            })} />
                        </CircularProgressbarWithChildren>
                      </div>
                        <img className="harnessStatusPng" src={safetyHarnessStatus==0?unlockedPng:safetyHarnessStatus==1?hangedPng:lockedPng} />
                        {/* <img className="harnessStatusPng" src={lockedPng} /> */}
                    </div>
                    <div className="idleContainer">
                      <div className="harnessIdle">
                        {!(stableLock&&stableHarness)?lockedStatusCountdown!=3?lockedStatusCountdown:"":"Idle"}
                      </div>
                    </div>
                    <div className="mpuContainer">
                      <MpuStatus mpu="Hook" connected={connectedLock} direction={directionLock} stable={stableLock} />
                      <MpuStatus mpu="Harness" connected={connectedHarness} direction={directionHarness} stable={stableHarness} />
                    </div>
                </div>
                <div className="safetyHarnessList">
                  <div className="safetyHarnessBrief">
                    Harness 1
                  </div>
                  <div className="safetyHarnessBriefDisconnected">Harness 2</div>
                  <div className="safetyHarnessBriefDisconnected">Harness 3</div>
                  <div className="safetyHarnessBriefDisconnected">Harness 4</div>

                </div>
              </div>
            
          </div>
    )
}

export default SafetyHarnessPanel