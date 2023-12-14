import {Container} from "@mui/material"
import React from "react"
import {Outlet} from "react-router-dom"
import Header from "../Components/Header"

export const Page = () => {
    return (
        <div>
            <Header/>
            <Container style={{
                marginTop: "2em"
            }}>
                <Outlet/>
            </Container>
        </div>
    )
}