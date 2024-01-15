import {ResponseError} from "../../utils/API"
import React, {Dispatch, SetStateAction, useEffect, useRef} from "react"
import {Alert} from "@mui/material"
import {ERROR_MESSAGE_CLASS} from "./ErrorMsg"

export function FormError(props: {error?: ErrorByField}) {
    const backendError = props.error
    const ref = useRef(null);
    useEffect(() => {
        if(backendError?.error) {
            ref.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [backendError, ref.current])

    if(!backendError || backendError.field !== FORM) {
        return null;
    }

    return <Alert
        ref={ref}
        className={ERROR_MESSAGE_CLASS} severity="error"
    >
        Could not save: {backendError.error.message}
    </Alert>
}

/**
 * Filter backend errors by their message constraint,
 * or return generic {@link FORM} error
 */
export async function setBackendErrors(error: ResponseError, dispatch: DispatchError) {
    const errorResponseBody = await error.response.json()
    if (errorResponseBody.message.includes("UNIQUE_TITLE_CONSTRAINT")) {
        dispatch({
            field: "title",
            error: {message: "Title already exists"}}
        )
    } else {
        dispatch({
            field: FORM,
            error: {message: errorResponseBody.message}
        })
    }
}

export type GenericFormError = Pick<Error, "message">
export type FormField = string | "form"
export type ErrorByField = { field: FormField, error: GenericFormError }
type DispatchError = Dispatch<SetStateAction<ErrorByField>>
const FORM = "form"

