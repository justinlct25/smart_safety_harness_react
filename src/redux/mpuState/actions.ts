

export function moveLockMpu(){
    return {
        type: '@@mpu/LOCK_MOVE' as '@@mpu/LOCK_MOVE',
        stable: false
    }
}

export function moveHarnessMpu(){
    return {
        type: '@@mpu/MOVE' as '@@mpu/MOVE',
        stable: false
    }
}

export function stableMpu(){
    return {
        type: '@@mpu/STABLE' as '@@mpu/STABLE',
        stable: true
    }
}

export function updateMpuDirection(directionId: number){
    return {
        type: '@@mpu/UPDATE_DIRECTION' as '@@mpu/UPDATE_DIRECTION',
        direction: directionId
    }
}

export function connectMpu(){
    return {
        type: '@@mpu/CONNECT' as '@@mpu/CONNECT',
        connected: true
    }
}

export function disconnectMpu(){
    return {
        type: '@@mpu/DISCONNECT' as '@@mpu/DISCONNECT',
        connected: false
    }
}

export type MpuStatusActions = ReturnType<
    | typeof moveLockMpu
    | typeof moveHarnessMpu
    | typeof stableMpu
    | typeof updateMpuDirection
    | typeof connectMpu
    | typeof disconnectMpu
>;