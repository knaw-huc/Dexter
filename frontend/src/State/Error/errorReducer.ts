import React from "react"
import {Actions} from "../actions"

export interface ErrorState {
    error: Error
}

export const initState: ErrorState = {
    error: null
}

export type ErrorAction = Actions.REMOVE_ERROR | Error;

export const useErrorState = (): [ErrorState, React.Dispatch<ErrorAction>] => {
    return React.useReducer(errorReducer, initState)
}

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
    if(action instanceof Error) {
        return {...state, error: action}
    }
    if(action === Actions.REMOVE_ERROR) {
        return {...state, error: null}
    }
    return state
}
