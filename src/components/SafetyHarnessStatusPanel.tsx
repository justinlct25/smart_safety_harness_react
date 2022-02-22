import React from 'react'
import { IHarnessStatus } from '../interface'
import "../styles.css"
import { SAFETY_HARNESS_STATUS } from '../App'

const HarnessStatus:any = {
    0: "Unlocked",
    1: "Hanged on Person",
    2: "Locked",
}

const SafetyHarnessStatusPanel = (props: IHarnessStatus) => {

    return (
        <div className={!props.connected?"harnessStatusPanelContainerDisconnected":
                            props.statusId==SAFETY_HARNESS_STATUS["UNLOCKED"]?"harnessStatusPanelContainerUnlocked":
                            props.statusId==SAFETY_HARNESS_STATUS["HANGED"]?"harnessStatusPanelContainerHanged":
                            "harnessStatusPanelContainerLocked"}>
            <div>Connected: {props.connected?"true":"false"}</div>
            <div>Status: {HarnessStatus[props.statusId]}</div>
        </div>
    )
}

export default SafetyHarnessStatusPanel