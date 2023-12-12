import {createContext, Dispatch} from "react"
import {ErrorAction, ErrorState, initState} from "./errorReducer"

export interface ErrorContext {
    errorState: ErrorState,
    updateError: Dispatch<ErrorAction>
}

const initErrorContext: ErrorContext = {
    errorState: initState,
    updateError: null
}

export const errorContext = createContext<ErrorContext>(initErrorContext)