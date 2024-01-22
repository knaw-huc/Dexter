import React from "react"
import styled from "@emotion/styled"

export const ERROR_MESSAGE_CLASS = "error-msg"

export const ErrorMsgStyled = styled.p`
  color: red;
  margin-top: 0.5em;
  margin-bottom: 0;
`
export function ErrorMsg(props: { msg: string }) {
    if (!props.msg) {
        return null
    }
    return <ErrorMsgStyled
        className={ERROR_MESSAGE_CLASS}
    >
        {props.msg}
    </ErrorMsgStyled>
}