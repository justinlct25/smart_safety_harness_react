// import {useDispatch, useSelector} from 'react-redux';
// import {RootState} from '.././redux/store';

import React from 'react'
import { IMpuStatus } from '../interface'

const MpuStatusPanel = (props: IMpuStatus) => {

    return (
        <div>
            <div>{props.mpu}</div>
            <div>Connected: {props.connected?"true":"false"}</div>
            <div>Direction: {props.direction}</div>
            <div>Stable: {props.stable?1:0}</div>
        </div>
    )
}

export default MpuStatusPanel