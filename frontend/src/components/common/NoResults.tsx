import styled from "@emotion/styled"
import React from "react"

const NoResultsMessageStyled = styled.p`
  color: gray;
  text-align: center;
  margin: 4em 0 5em 0;
`
export function NoResults(props: {message: string}) {
    return <NoResultsMessageStyled>{props.message}</NoResultsMessageStyled>
}