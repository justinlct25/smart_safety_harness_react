import React, {useEffect, useState} from 'react'
import {CircularProgressbar} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import "../styles.css"
import { IMpuData } from '../interface'

const ACCELERATE_RANGE = 80000;
const ACCELERATE_DIFF_RANGE = 40000;

const calPositiveRatio = (num:number, range:number) => {
    return Number((Number(num)+Number(Number(range)/2))/Number(range)*100)
}
const calDiffRatio = (num:number, range:number) => {
    if(num<0){
        return Number(-(Number(num)/Number(range))*100)
    }else{
        return Number((Number(num)/Number(range))*100)
    }
}

const MpuStatusPanel = (props: IMpuData) => {

    const [accX, setAccX] = useState<number>(0);
    const [accY, setAccY] = useState<number>(0);
    const [accZ, setAccZ] = useState<number>(0);
    const [diffAccX, setDiffAccX] = useState<number>(0);
    const [diffAccY, setDiffAccY] = useState<number>(0);
    const [diffAccZ, setDiffAccZ] = useState<number>(0);

    const updateAccDiff = (props: IMpuData) => {
        setDiffAccX(props.mpuData.acc_x - accX);
        setDiffAccY(props.mpuData.acc_y - accY);
        setDiffAccZ(props.mpuData.acc_z - accZ);
        setAccX(props.mpuData.acc_x);
        setAccY(props.mpuData.acc_y);
        setAccZ(props.mpuData.acc_z);
    }

    useEffect(()=>{
        updateAccDiff(props)
    },[props])


    return (
        <div>
            <div>{props.mpuData.name}</div>
            <div className="mpuStatusPanelContainer">
                <div className="mpuRatioCircular">
                    <div>Accelerate X</div>
                    <CircularProgressbar value={calDiffRatio(diffAccX, ACCELERATE_DIFF_RANGE)} text={diffAccX<0?(-diffAccX).toString():diffAccX.toString()} circleRatio={1} />
                </div>
                <div className="mpuRatioCircular">
                    <div>Accelerate Y</div>
                    <CircularProgressbar value={calDiffRatio(diffAccY, ACCELERATE_DIFF_RANGE)} text={diffAccY<0?(-diffAccY).toString():diffAccY.toString()} circleRatio={1} />
                </div>
                <div className="mpuRatioCircular">
                    <div>Accelerate Z</div>
                    <CircularProgressbar value={calDiffRatio(diffAccZ, ACCELERATE_DIFF_RANGE)} text={diffAccZ<0?(-diffAccZ).toString():diffAccZ.toString()} circleRatio={1} />
                </div>
            </div>
        </div>
    )
}

export default MpuStatusPanel;