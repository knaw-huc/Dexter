import React from "react"
import styled from "styled-components"
import { Link, Outlet } from "react-router-dom"
//import Config from "../Config"

const NavStyled = styled.nav`
    border-bottom: "solid 1px";
    padding-bottom: 1rem;
`

// fetch(Config.BACKEND_HOST)
//     .then(function(response) {
//         console.log(response)
//     })

export const Home = () => {
    return (
        <div>
            <h1>Dexter</h1>
            <NavStyled id="nav">
                <Link to="/">Home</Link> | {" "}
                <Link to="/collections">Collections</Link> | {" "}
                <Link to="/sources">Sources</Link>
            </NavStyled>
            <Outlet />
        </div>
    )
}