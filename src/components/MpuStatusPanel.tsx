import React from 'react'
import {CircularProgressbar} from "react-circular-progressbar"
import "../styles.css"


export interface MpuData {
    name: string,
    acc_x: number,
    acc_y: number,
    acc_z: number
}

const MpuStatusPanel = (props: MpuData) => {


    return (
        <div className="mpuStatusPanelContainer">
            <div style={{width:200, height:200}}>
                <CircularProgressbar value={10} text={"sad"} circleRatio={1} />
            </div>
            <div style={{width:200, height:200}}>
                <CircularProgressbar value={10} text={"sad"} circleRatio={1} />
            </div>
            <div style={{width:200, height:200}}>
                <CircularProgressbar value={10} text={"sad"} circleRatio={1} />
            </div>
        </div>
    )
}

export default MpuStatusPanel;