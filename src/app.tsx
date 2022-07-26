import React from "react"
import { Link, Outlet } from "react-router-dom"
import styled from "styled-components"

const NavStyled = styled.nav`
    border-bottom: "solid 1px";
    padding-bottom: 1rem;
`

export function App() {
    return (
        <div>
            <h1>Dexter</h1>
            <NavStyled id="nav">
                <Link to="/">Home</Link> | {" "}
                <Link to="/collections">Collections</Link> | {" "}
                <Link to="/resources">Resources</Link>
            </NavStyled>
            <Outlet />
        </div>
    )
}