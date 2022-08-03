import React from "react"
import { appContext } from "../State/context"

export function CollectionItemContent() {
    const { state } = React.useContext(appContext)
    return (
        <div>
            {state.selectedCollection &&
                <>
                    <p>Title: {state.selectedCollection.title}</p>
                    <p>Description: {state.selectedCollection.description}</p>
                    <p>Main or sub collection: {state.selectedCollection.mainorsub}</p>
                    <p>Creator: {state.selectedCollection.creator}</p>
                    <p>Subject: {state.selectedCollection.subject}</p>
                    <p>Rights: {state.selectedCollection.rights}</p>
                    <p>Access: {state.selectedCollection.access}</p>
                    <p>Created: {state.selectedCollection.created}</p>
                    <p>Spatial: {state.selectedCollection.spatial}</p>
                    <p>Temporal: {state.selectedCollection.temporal}</p>
                    <p>Language: {state.selectedCollection.language}</p>
                </>
            }
        </div>
    )
}