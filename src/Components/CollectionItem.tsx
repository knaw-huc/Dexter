import React from "react"
import { Collections } from "../Model/DexterModel"
import { Route, Routes, useNavigate } from "react-router-dom"
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
    const navigate = useNavigate()

    function toggleOpen() {
        setOpen(!isOpen)
        navigate(`/collections/${props.collection.id}`)   
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
            {isOpen &&
                <Routes>
                    <Route path=":collectionId" element={<CollectionItemContent item={props.collection} />} />
                </Routes>}
            {/* {isOpen && <CollectionItemContent item={props.collection} />} */}
        </>
    )
}

{/* <Link style={{ display: "block", margin: "1rem 0" }} to={`/collections/${props.collectionId}`} key={props.collectionId}>
        
</Link> */}