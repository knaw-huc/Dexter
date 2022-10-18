import React from "react"
import styled from "@emotion/styled"
import { Link, Outlet } from "react-router-dom"
//import Config from "../Config"

const NavStyled = styled.nav`
    border-bottom: "solid 1px";
    padding-bottom: 1rem;
`

console.log("Hoi allemaal!")
//console.log(process.env.REACT_APP_BACKEND_HOST)

async function testFetch() {
    const response = await fetch("api/about")
    const json = await response.json()
    console.log(json)
}

testFetch()

export const Home = () => {
    return (
        <div>
            <h1>Dexter</h1>
            <NavStyled id="nav">
                <Link to="/">Home</Link> | {" "}
                <Link to="/corpora">Corpora</Link> | {" "}
                <Link to="/sources">Sources</Link> | {" "}
                <Link to="/keywords">Keywords</Link>
            </NavStyled>
            <Outlet />
        </div>
    )
}