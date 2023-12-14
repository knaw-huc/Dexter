import {Container} from "@mui/material"
import React from "react"
import {Outlet} from "react-router-dom"
import Header from "../Header"

export const Page = () => {
    return (
        <div>
            <Header/>
            <Container>
                <Outlet/>
            </Container>
        </div>
    )
}