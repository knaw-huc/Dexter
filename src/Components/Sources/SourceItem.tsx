import React from "react"
import { Sources } from "../../Model/DexterModel"

type SourceItemProps = {
    sourceId: React.Key,
    source: Sources
}

export const SourceItem = (props: SourceItemProps) => {
    return (
        <ul>
            <li key={props.sourceId}>
                {props.source.id} {props.source.title}
            </li>
        </ul>
    )
}