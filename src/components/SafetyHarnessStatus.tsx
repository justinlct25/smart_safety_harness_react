import React from 'react'
import { IHarnessStatus } from '../interface'
import "../styles.css"
import { SAFETY_HARNESS_STATUS } from './SafetyHarnessPanel'
import lockedPng from '../media/locked.png'
import hangedPng from '../media/hanged.png'
import unlockedPng from '../media/unlocked.png'

const HarnessStatus:any = {
    0: "Unlocked",
    1: "Hanged on Person",
    2: "Locked",
}
//

const SafetyHarnessStatus = (props: IHarnessStatus) => {

    return (
        // <div className={!props.connected?"harnessStatusPanelContainerDisconnected":
        //                     props.statusId==SAFETY_HARNESS_STATUS["UNLOCKED"]?"harnessStatusPanelContainerUnlocked":
        //                     props.statusId==SAFETY_HARNESS_STATUS["HANGED"]?"harnessStatusPanelContainerHanged":
        //                     "harnessStatusPanelContainerLocked"}>
        <div className="harnessStatusContainer">
                {/* <div className="harnessInfoRowUpper"> */}
                    <div className="harnessInfo">
                        <div className="harnessNo">Harness {props.mpuNo}</div> 
                        <div className="harnessId">ID: {props.mpuId}</div>                             
                    </div>
                    {/* <div className="harnessIdle">{props.idle?"Idle":""}</div>   */}
                {/* </div> */}
                {/* <div className="harnessInfoRowDown">
                    <div className={props.statusId==1?"harnessStatusHanged":"harnessStatus"}>
                        {props.connected?HarnessStatus[props.statusId]:"Disconnected"}
                    </div>
                </div> */}
        </div>
    )
}

export default SafetyHarnessStatus