import {createContext, Dispatch} from "react"
import {ErrorAction, ErrorState, initState} from "./errorReducer"

export interface ErrorContext {
    errorState: ErrorState,
    setError: Dispatch<ErrorAction>
}

const initErrorContext: ErrorContext = {
    errorState: initState,
    setError: null
}

export const errorContext = createContext<ErrorContext>(initErrorContext)