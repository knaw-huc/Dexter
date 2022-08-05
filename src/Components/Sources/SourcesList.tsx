import React from "react"
import styled from "styled-components"

const ResourcesStyled = styled.main`
    padding: 1rem 0;
`

export function SourcesList() {
    return (
        <ResourcesStyled>
            <h2>Resources</h2>
            <form>
                <label>
                    Test:
                    <input type="text" name="test" /><br />
                </label>
                <label>
                    Test2:
                    <input type="text" name="test2" /><br />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </ResourcesStyled>
    )
}