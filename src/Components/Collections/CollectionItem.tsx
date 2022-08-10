import React from "react"
import { Collections } from "../../Model/DexterModel"
import { Link } from "react-router-dom"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections,
    selected: boolean,
    onSelect: (selected: Collections | undefined) => void,
    refetch: any
}

export function CollectionItem(props: CollectionItemProps) {
    const { onSelect, collection } = props

    const toggleClick = () => {
        console.log(props.collection.metadata.id)
        onSelect(collection)
    }

    return (
        <>
            <ul>
                <li key={props.collectionId}>
                    <Link to={`/collections/${props.collection.metadata.id}`} key={props.collectionId} onClick={toggleClick}>
                        {props.collection.metadata.id} {props.collection.metadata.title}
                    </Link>
                </li>
            </ul>
        </>
    )
}