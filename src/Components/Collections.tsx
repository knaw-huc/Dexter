import React from "react"
import styled from "styled-components"

const CollectionsStyled = styled.main`
    padding: 1rem 0;
`

export function Collections() {
    return (
        <CollectionsStyled>
            <h2>Collections</h2>
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
        </CollectionsStyled>
    )
}