// import {useDispatch, useSelector} from 'react-redux';
// import {RootState} from '.././redux/store';
import React from 'react'
import { IMpuStatus } from '../interface'
import "../styles.css"
import hookSvg from '../media/hook.png'
import harnessSvg from '../media/harness.png'
import hyphenSvg from '../media/hyphen.png'
import chevronUpSvg from '../media/chevron-up.svg'
import chevronDownSvg from '../media/chevron-down.svg'

const MpuStatus = (props: IMpuStatus) => {

    return (
        <div className="mpuStatusContainer">
            {/* <div>{props.mpu}</div> */}
            <div className="mpuStatus">{props.connected?props.stable?"Stable":"Moving":"Disconnected"}</div>
            {props.mpu=="Hook"?<img className="mpuLogo" src={hookSvg} />:<img className="mpuLogo" src={harnessSvg} />}
            <div>{props.direction==1?<img className="directionLogo" src={chevronUpSvg} />:props.direction==2?<img className="directionLogo" src={chevronDownSvg} />:<img className="directionLogo" src={hyphenSvg} />}</div>
            {/* <div>Stable: {props.stable?1:0}</div> */}
        </div>
    )
}

export default MpuStatus