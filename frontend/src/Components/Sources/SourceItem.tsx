import React from "react"
import { Source } from "../../Model/DexterModel"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"
import { deleteSource, getSources } from "../API"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { ACTIONS } from "../../State/actions"
import DeleteIcon from "@mui/icons-material/Delete"

type SourceItemProps = {
    sourceId: React.Key,
    source: Source,
    onSelect: (selected: Source | undefined) => void,
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    &:hover {
        cursor: pointer;
        color: gray;
    }
`

export const SourceItem = (props: SourceItemProps) => {
    const { setSources } = React.useContext(sourcesContext)

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
                setSources({
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
                <DeleteIconStyled color="error" onClick={() => handleDelete(props.source.id)}>Delete source</DeleteIconStyled>
            </li>
        </ul>
    )
}