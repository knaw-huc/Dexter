import React from "react"
import { ErrorAction, ErrorState, initErrorState } from "./errorReducer"

interface ErrorContext {
    errorState: ErrorState,
    errorDispatch: React.Dispatch<ErrorAction>
}

const initErrorContext: ErrorContext = {
    errorState: initErrorState,
    errorDispatch: null
}

export const errorContext = React.createContext<ErrorContext>(initErrorContext)