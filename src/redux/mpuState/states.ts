export interface mpuStatusState{
    mpu: String;
    connected: boolean;
    stable: boolean;
    direction: number;
}

export const initialMpuLockStatus: mpuStatusState = {
    mpu: "Lock",
    connected: false,
    stable: false,
    direction: 0
}

export const initialMpuHarnessStatus: mpuStatusState = {
    mpu: "Harness",
    connected: false,
    stable: false,
    direction: 0
}