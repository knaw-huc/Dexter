import React from "react"
import { Collections } from "../Model/DexterModel"
import { Link } from "react-router-dom"
import { NewCollection } from "./NewCollection"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections,
    selected: boolean,
    onSelect: (selected: Collections | undefined) => void,
    refetch: any
}

export function CollectionItem(props: CollectionItemProps) {
    const { onSelect, collection } = props
    const [showForm, setShowForm] = React.useState(false)
    const [editCollection, setEditCollection] = React.useState(false)
    const [toEditCollection, setToEditCollection] = React.useState(null)

    const toggleClick = () => {
        console.log(props.collection.id)
        onSelect(collection)
    }

    const formShowHandler = () => {
        setToEditCollection(props.collection)
        editHandler(true)
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    const editHandler = (boolean: boolean) => {
        setEditCollection(boolean)
    }

    return (
        <>
            <ul>
                <li key={props.collectionId}>
                    <Link to={`/collections/${props.collection.id}`} key={props.collectionId} onClick={toggleClick}>
                        {props.collection.id} {props.collection.title}
                    </Link>
                    <button onClick={formShowHandler}>Edit</button>
                    {/* TODO: Add logic in NewCollection component to support editting collection. See: https://stackblitz.com/edit/react-hook-form-crud-example for some inspiration */}
                </li>
            </ul>
            {editCollection && <NewCollection show={showForm} onEdit={editHandler} edit={editCollection} colToEdit={toEditCollection} onClose={formCloseHandler} refetch={props.refetch} />}
        </>
    )
}