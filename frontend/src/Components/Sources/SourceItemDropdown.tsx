import React from "react"
import { ServerSource } from "../../Model/DexterModel"
import styled from "@emotion/styled"
import { getSourceInCorpus } from "../API"
import { SourceItemDropdownContent } from "./SourceItemDropdownContent"

interface SourceItemDropdownProps {
    corpusId: string
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
    const [sources, setSources] = React.useState<ServerSource[]>(null)

    const doGetSourceInCorpus = async (corpusId: string) => {
        const srcs = await getSourceInCorpus(corpusId)
        setSources(srcs)
        console.log(srcs)
    }

    const toggleOpen = () => {
        setOpen(!isOpen)
    }

    React.useEffect(() => {
        doGetSourceInCorpus(props.corpusId)
    }, [props.corpusId])

    return (
        <>
            {sources && sources.map((source, index) => {
                return (
                    <SourceSnippet key={index} id="source-snippet">
                        <Clickable onClick={toggleOpen} id="clickable">
                            {source.title}
                        </Clickable>
                        {isOpen && <SourceItemDropdownContent source={source} />}
                    </SourceSnippet>
                )
            })}
        </>
    )
}