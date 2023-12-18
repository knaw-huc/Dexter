import React, {useContext} from "react"
import {Source} from "../../Model/DexterModel"
import {Link} from "react-router-dom"
import styled from "@emotion/styled"
import {deleteSource, getSources} from "../../utils/API"
import {sourcesContext} from "../../State/Sources/sourcesContext"
import {Actions} from "../../State/actions"
import DeleteIcon from "@mui/icons-material/Delete"
import {errorContext} from "../../State/Error/errorContext"

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
    const {setSources} = React.useContext(sourcesContext)
    const {setError} = useContext(errorContext)

    const toggleClick = () => {
        props.onSelect(props.source)
    }

    const handleDelete = async (id: string) => {
        const warning = window.confirm("Are you sure you wish to delete this source?")

        if (warning === false) {
            return
        }

        await deleteSource(id)
            .catch(setError)
        getSources().then(sources => setSources({
            type: Actions.SET_SOURCES,
            sources: sources
        })).catch(setError)
    }

    return (
        <ul>
            <li key={props.sourceId}>
                <Link
                    to={`/sources/${props.source.id}`}
                    key={props.sourceId}
                    onClick={toggleClick}
                >
                    {props.source.title}
                </Link>
                <DeleteIconStyled
                    color="error"
                    onClick={() => handleDelete(props.source.id)}
                >
                    Delete source
                </DeleteIconStyled>
            </li>
        </ul>
    )
}