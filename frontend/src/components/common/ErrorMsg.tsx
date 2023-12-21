import React from "react"

export const ERROR_MESSAGE_CLASS = "error-msg"
export function ErrorMsg(props: { msg: string }) {
    if (!props.msg) {
        return null
    }
    return <p
        className={ERROR_MESSAGE_CLASS}
        style={{color: "red"}}
    >
        {props.msg}
    </p>
}