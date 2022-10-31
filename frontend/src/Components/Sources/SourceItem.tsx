import React from "react"
import { ServerSource } from "../../Model/DexterModel"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"
import { deleteSource, getSources } from "../API"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { ACTIONS } from "../../State/actions"
import DeleteIcon from "@mui/icons-material/Delete"
import { red } from "@mui/material/colors"

type SourceItemProps = {
    sourceId: React.Key,
    source: ServerSource,
    onSelect: (selected: ServerSource | undefined) => void,
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    color: gray;
    &:hover {
        cursor: pointer;
        color: ${red[700]};
    }
`

export const SourceItem = (props: SourceItemProps) => {
    const { sourcesDispatch } = React.useContext(sourcesContext)

    const toggleClick = () => {
        console.log(props.source.id)
        props.onSelect(props.source)
    }

    const handleDelete = async (id: string) => {
        const warning = window.confirm("Are you sure you wish to delete this source?")

        if (warning === false) return

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
                    {props.source.title}
                </Link>
                <DeleteIconStyled onClick={() => handleDelete(props.source.id)} />
            </li>
        </ul>
    )
}