import React from "react"
//import { useParams } from "react-router-dom"
import { Collections } from "../Model/DexterModel"

type CollectionItemContentProps = {
    item: Collections
}

export function CollectionItemContent(props: CollectionItemContentProps) {
    //const params = useParams()
    //TODO: Make this its own page via react-router-dom
    return (
        <div>
            <p>Title: {props.item.title}</p>
            <p>Description: {props.item.description}</p>
            <p>Main or sub collection: {props.item.mainorsub}</p>
            <p>Creator: {props.item.creator}</p>
            <p>Subject: {props.item.subject}</p>
            <p>Rights: {props.item.rights}</p>
            <p>Access: {props.item.access}</p>
            <p>Created: {props.item.created}</p>
            <p>Spatial: {props.item.spatial}</p>
            <p>Temporal: {props.item.temporal}</p>
            <p>Language: {props.item.language}</p>
        </div>
    )
}