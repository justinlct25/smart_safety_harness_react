import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
// import thunk, {ThunkDispatch as OldThunkDispatch} from 'redux-thunk';
import { mpuStatusState } from "./mpuState/states";
import { MpuStatusActions } from "./mpuState/actions";
import { mpuLockStatusReducer, mpuHarnessStatusReducer } from "./mpuState/reducers";


export interface RootState {
    mpuLockStatus: mpuStatusState;
    mpuHarnessStatus: mpuStatusState;
}

export type RootActions = 
    | MpuStatusActions


const reducer = combineReducers<RootState>({
    mpuLockStatus: mpuLockStatusReducer,
    mpuHarnessStatus: mpuHarnessStatusReducer
})

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

// export type ThunkDispatch = OldThunkDispatch<RootState, null, RootActions>;

export const store = createStore<RootState, RootActions, {}, {}>(reducer);