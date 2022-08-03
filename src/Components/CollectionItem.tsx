import React from "react"
import { Collections } from "../Model/DexterModel"
import { Link } from "react-router-dom"
import styled from "styled-components"

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections,
    selected: boolean,
    onSelect: (selected: Collections | undefined) => void
}

const Clickable = styled.div`
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    &:hover {
        text-decoration: underline;
    }
`

export function CollectionItem(props: CollectionItemProps) {
    const { onSelect, collection } = props

    const toggleClick = () => {
        console.log(props.collection.id)
        onSelect(collection)
    }

    return (
        <>
            <Link to={`/collections/${props.collection.id}`} key={props.collectionId}>
                <Clickable onClick={toggleClick}>
                    <ul>
                        <li key={props.collectionId}>
                            {props.collection.id} {props.collection.title} <button>Edit</button>
                            {/* TODO: Add logic in NewCollection component to support editting collection. See: https://stackblitz.com/edit/react-hook-form-crud-example for some inspiration */}
                        </li>
                    </ul>
                </Clickable>
            </Link>
        </>
    )
}