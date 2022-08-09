import React from "react"
import { Sources } from "../../Model/DexterModel"
import { Link } from "react-router-dom"

type SourceItemProps = {
    sourceId: React.Key,
    source: Sources
}

export const SourceItem = (props: SourceItemProps) => {
    return (
        <ul>
            <li key={props.sourceId}>
                <Link to={`/sources/${props.source.id}`} key={props.sourceId}>
                    {props.source.id} {props.source.title}
                </Link>
            </li>
        </ul>
    )
}