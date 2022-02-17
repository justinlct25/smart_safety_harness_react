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

