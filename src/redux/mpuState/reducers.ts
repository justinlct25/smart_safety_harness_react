import {mpuStatusState, initialMpuLockStatus, initialMpuHarnessStatus} from "./states"
import {MpuStatusActions} from "./actions"


export const mpuLockStatusReducer = (
    state: mpuStatusState = initialMpuLockStatus,
    action: MpuStatusActions,
):mpuStatusState => {
    switch(action.type){
        case '@@mpu/CONNECT':
            return {
                ...state,
                connected: action.connected
            }
        case '@@mpu/DISCONNECT':
            return {
                ...state,
                connected: action.connected
            }
        case '@@mpu/LOCK_MOVE':
            return {
                ...state,
                stable: action.stable
            }
        case '@@mpu/STABLE':
            return {
                ...state,
                stable: action.stable
            }
        case '@@mpu/UPDATE_DIRECTION':
            return {
                ...state,
                direction: action.direction
            }
        default:
            return state;
    }
}

export const mpuHarnessStatusReducer = (
    state: mpuStatusState = initialMpuHarnessStatus,
    action: MpuStatusActions,
):mpuStatusState => {
    switch(action.type){
        case '@@mpu/CONNECT':
            return {
                ...state,
                connected: action.connected
            }
        case '@@mpu/DISCONNECT':
            return {
                ...state,
                connected: action.connected
            }
        case '@@mpu/LOCK_MOVE':
            return {
                ...state,
                stable: action.stable
            }
        case '@@mpu/STABLE':
            return {
                ...state,
                stable: action.stable
            }
        case '@@mpu/UPDATE_DIRECTION':
            return {
                ...state,
                direction: action.direction
            }
        default:
            return state;
    }
}