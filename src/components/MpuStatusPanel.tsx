// import {useDispatch, useSelector} from 'react-redux';
// import {RootState} from '.././redux/store';

import React from 'react'
import { IMpuStatus } from '../interface'
import "../styles.css"

const MpuStatusPanel = (props: IMpuStatus) => {

    return (
        <div className="mpuStatusPanelContainer">
            <div>{props.mpu}</div>
            <div>Connected: {props.connected?"true":"false"}</div>
            <div>Direction: {props.direction}</div>
            <div>Stable: {props.stable?1:0}</div>
        </div>
    )
}

export default MpuStatusPanel