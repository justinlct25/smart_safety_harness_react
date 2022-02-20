export interface IMpuData {
    mpuData:{
        name: string,
        acc_x: number,
        acc_y: number,
        acc_z: number
    }
}

export const IMpuLockDataInitial:IMpuData = {
    mpuData:{
        name: 'Lock',
        acc_x: 0,
        acc_y: 0,
        acc_z: 0
    }
}

export const IMpuHarnessDataInitial:IMpuData = {
    mpuData:{
        name: 'Harness',
        acc_x: 0,
        acc_y: 0,
        acc_z: 0
    }
}

export interface IMpuStatus {
    mpu: String,
    connected: boolean,
    stable: boolean,
    direction: number
}

export const LockMpuStatusInitial:IMpuStatus = {
    mpu: "Lock",
    connected: false,
    stable: false,
    direction: 0
}

export const HarnessMpuStatusInitial:IMpuStatus = {
    mpu: "Harness",
    connected: false,
    stable: false,
    direction: 0
}

export interface IHarnessStatus {
    connected: boolean,
    statusId: number
}