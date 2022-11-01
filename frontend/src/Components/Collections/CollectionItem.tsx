import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import { red } from "@mui/material/colors"
import React from "react"
import { Link } from "react-router-dom"
import { ServerCorpus } from "../../Model/DexterModel"
import { ACTIONS } from "../../State/actions"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { deleteCollection, getCollections } from "../API"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: ServerCorpus,
    onSelect: (selected: ServerCorpus | undefined) => void,
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    color: gray;
    &:hover {
        cursor: pointer;
        color: ${red[700]};
    }
`

export function CollectionItem(props: CollectionItemProps) {
    const { collectionsDispatch } = React.useContext(collectionsContext)

    const toggleClick = () => {
        props.onSelect(props.collection)
    }

    const handleDelete = async (collection: ServerCorpus) => {
        const warning = window.confirm("Are you sure you wish to delete this corpus?")

        if (warning === false) return

        await deleteCollection(collection.id)
        getCollections()
            .then(function (collections) {
                collectionsDispatch({
                    type: ACTIONS.SET_COLLECTIONS,
                    collections: collections
                })
            })
    }

    return (
        <>
            <ul>
                <li key={props.collectionId}>
                    <Link to={`/corpora/${props.collection.id}`} key={props.collectionId} onClick={toggleClick}>
                        {props.collection.title}
                    </Link>
                    <DeleteIconStyled onClick={() => handleDelete(props.collection)} />
                </li>
            </ul>
        </>
    )
}