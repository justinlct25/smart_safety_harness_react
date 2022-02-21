import React from 'react'
import { IHarnessStatus } from '../interface'
import "../styles.css"

const HarnessStatus:any = {
    0: "Unlocked",
    1: "Hanged on Person",
    2: "Locked",
}

const SafetyHarnessStatusPanel = (props: IHarnessStatus) => {

    return (
        <div className="harnessStatusPanelContainer">
            {/* <div>Connected: {props.connected?"true":"false"}</div> */}
            <div>Status: {HarnessStatus[props.statusId]}</div>
        </div>
    )
}

export default SafetyHarnessStatusPanel