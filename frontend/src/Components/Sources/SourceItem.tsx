import React from "react"
import { Sources } from "../../Model/DexterModel"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"
import { Button } from "react-bootstrap"
import { deleteSource, getSources } from "../API"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { ACTIONS } from "../../State/actions"

type SourceItemProps = {
    sourceId: React.Key,
    source: Sources,
    onSelect: (selected: Sources | undefined) => void,
}

const ButtonStyled = styled(Button)`
    margin-left: 10px;
`

export const SourceItem = (props: SourceItemProps) => {
    const { sourcesDispatch } = React.useContext(sourcesContext)

    const toggleClick = () => {
        console.log(props.source.id)
        props.onSelect(props.source)
    }

    const handleDelete = async (id: string) => {
        await deleteSource(id)
        getSources()
            .then(function (sources) {
                sourcesDispatch({
                    type: ACTIONS.SET_SOURCES,
                    sources: sources
                })
            })
    }

    return (
        <ul>
            <li key={props.sourceId}>
                <Link to={`/sources/${props.source.id}`} key={props.sourceId} onClick={toggleClick}>
                    {props.source.id} {props.source.title}
                </Link>
                <ButtonStyled onClick={() => handleDelete(props.source.id)}>Delete source</ButtonStyled>
            </li>
        </ul>
    )
}