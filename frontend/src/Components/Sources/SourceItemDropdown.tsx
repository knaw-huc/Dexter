import styled from "@emotion/styled"
import React from "react"
import { ServerSource } from "../../Model/DexterModel"
import { SourceItemDropdownContent } from "./SourceItemDropdownContent"

interface SourceItemDropdownProps {
    source: ServerSource
}

const SourceSnippet = styled.div`
    margin: 5px 0;
    padding: 10px;
    border-style: solid;
    border-color: darkgray;
    border-width: 1px;
`

const Clickable = styled.div`
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    &:hover {
        text-decoration: underline;
    }
`

export const SourceItemDropdown = (props: SourceItemDropdownProps) => {
    const [isOpen, setOpen] = React.useState(false)

    const toggleOpen = () => {
        setOpen(!isOpen)
    }

    return (
        <>
            <SourceSnippet id="source-snippet">
                <Clickable onClick={toggleOpen} id="clickable">
                    {props.source.title}
                </Clickable>
                {isOpen && <SourceItemDropdownContent source={props.source} />}
            </SourceSnippet>
        </>
    )
}