import {Container} from "@mui/material"
import React from "react"
import {Outlet} from "react-router-dom"
import Header from ".//Header"
import ErrorHandler from "./ErrorHandler"
import {useErrorState} from "../state/error/errorReducer"

export const Page = () => {
    const [errorState] = useErrorState()

    return (
        <div>
            <Header/>
            <Container style={{
                marginTop: "2em"
            }}>
                <ErrorHandler error={errorState.error}>
                    <Outlet/>
                </ErrorHandler>
            </Container>
        </div>
    )
}