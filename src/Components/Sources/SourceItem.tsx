import React from "react"
import { Sources } from "../../Model/DexterModel"
import { Link } from "react-router-dom"

type SourceItemProps = {
    sourceId: React.Key,
    source: Sources,
    onSelect: (selected: Sources | undefined) => void,
}

export const SourceItem = (props: SourceItemProps) => {
    const toggleClick = () => {
        console.log(props.source.id)
        props.onSelect(props.source)
    }

    return (
        <ul>
            <li key={props.sourceId}>
                <Link to={`/sources/${props.source.id}`} key={props.sourceId} onClick={toggleClick}>
                    {props.source.id} {props.source.title}
                </Link>
            </li>
        </ul>
    )
}