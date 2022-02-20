import React from 'react'
import { IHarnessStatus } from '../interface'

const HarnessStatus:any = {
    0: "Unlocked",
    1: "Hanged on Person",
    2: "Locked",
}

const HarnessStatusPanel = (props: IHarnessStatus) => {

    return (
        <div>
            <div>Harness Status</div>
            <div>Connected: {props.connected}</div>
            <div>Status: {HarnessStatus[props.statusId]}</div>
        </div>
    )
}

export default HarnessStatusPanel