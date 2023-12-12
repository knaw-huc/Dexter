import React from "react"
import {Actions} from "../actions"

export interface ErrorState {
    error: Error
}

export const initState: ErrorState = {
    error: null
}

type SetError = {
    type: Actions.SET_ERROR,
    error: Error
}

export type ErrorAction = SetError;

export const useErrorState = (): [ErrorState, React.Dispatch<ErrorAction>] => {
    return React.useReducer(erroReducer, initState)
}

function erroReducer(state: ErrorState, action: ErrorAction): ErrorState {
    if(action.error) {
        return {...state, error: action.error}
    }
    return state
}
