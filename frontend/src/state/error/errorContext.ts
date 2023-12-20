import {createContext, Dispatch} from "react"
import {ErrorAction, ErrorState, initState} from "./errorReducer"

export interface ErrorContext {
    errorState: ErrorState,
    dispatchError: Dispatch<ErrorAction>
}

const initErrorContext: ErrorContext = {
    errorState: initState,
    dispatchError: null
}

export const errorContext = createContext<ErrorContext>(initErrorContext)