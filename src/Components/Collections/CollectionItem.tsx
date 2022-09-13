import React from "react"
import { Collections } from "../../Model/DexterModel"
import { Link } from "react-router-dom"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections,
    onSelect: (selected: Collections | undefined) => void,
}

export function CollectionItem(props: CollectionItemProps) {

    const toggleClick = () => {
        props.onSelect(props.collection)
    }

    return (
        <>
            <ul>
                <li key={props.collectionId}>
                    <Link to={`/collections/${props.collection.id}`} key={props.collectionId} onClick={toggleClick}>
                        {props.collection.id} {props.collection.title}
                    </Link>
                </li>
            </ul>
        </>
    )
}