import React from "react"
import { Collections } from "../../Model/DexterModel"
import { Link } from "react-router-dom"
import { deleteCollection, getCollections } from "../API"
import styled from "@emotion/styled"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { ACTIONS } from "../../State/actions"
import DeleteIcon from "@mui/icons-material/Delete"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections,
    onSelect: (selected: Collections | undefined) => void,
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    &:hover {
        cursor: pointer;
        color: gray;
    }
`

export function CollectionItem(props: CollectionItemProps) {
    const { collectionsDispatch } = React.useContext(collectionsContext)

    const toggleClick = () => {
        props.onSelect(props.collection)
    }

    const handleDelete = async (id: string) => {
        await deleteCollection(id)
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
                        {props.collection.id} {props.collection.title}
                    </Link>
                    <DeleteIconStyled onClick={() => handleDelete(props.collection.id)}>Delete corpus</DeleteIconStyled>
                </li>
            </ul>
        </>
    )
}