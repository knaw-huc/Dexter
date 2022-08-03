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
    const [clicked, setClicked] = React.useState(false)
    const { onSelect, collection } = props

    const toggleClick = () => {
        setClicked(!clicked)
        console.log(props.collection.id)
        onSelect(collection)
    }

    return (
        <>
            <Link to={`/collections/${props.collection.id}`} key={props.collectionId}>
                <Clickable onClick={toggleClick}>
                    <ul>
                        <li key={props.collectionId}>
                            {props.collection.id} {props.collection.title}
                        </li>
                    </ul>
                </Clickable>
            </Link>
        </>
    )
}