import React from "react"
import { Collections } from "../Model/DexterModel"
//import { Link } from "react-router-dom"
import { CollectionItemContent } from "./CollectionItemContent"
import styled from "styled-components"

const Clickable = styled.div`
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    &:hover {
        text-decoration: underline;
    }
`

type CollectionItemProps = {
    collectionId: React.Key,
    collection: Collections
}

export function CollectionItem(props: CollectionItemProps) {
    const [isOpen, setOpen] = React.useState(false)

    function toggleOpen() {
        setOpen(!isOpen)
    }

    return (
        <>
            <Clickable onClick={toggleOpen}>
                <ul>
                    <li key={props.collectionId}>
                        {props.collection.id} {props.collection.title}
                    </li>
                </ul>
            </Clickable>
            {isOpen && <CollectionItemContent item={props.collection} />}
        </>
    )
}