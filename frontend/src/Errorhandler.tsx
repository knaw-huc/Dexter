import React, {Component, PropsWithChildren} from "react"
import {ErrorState} from "./State/Error/errorReducer"
import {Alert} from "@mui/material"

type ErrorBoundaryProps = PropsWithChildren & {
    errorState: ErrorState
}

type ErrorBoundaryState = {
    error: Error
}

/**
 * Error boundary displaying:
 * - error thrown/caught in children of ErrorBoundary
 * - or error present in props\.error
 */
export default class Errorhandler extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            error: props.errorState.error
        }
    }

    static getDerivedStateFromError(error: Error) {
        return {error}
    }

    componentDidCatch(error: Error) {
        console.error(error)
    }

    render() {
        const error = this.state.error || this.props.errorState.error
        if (!error) {
            return this.props.children
        }
        return <>
            <Alert severity="error">Er trad een fout op: <code>{error.message}</code></Alert>
            <pre style={{
                height: "10em", overflowY: "scroll"
            }}>
                {error.stack}
            </pre>
        </>
    }
}