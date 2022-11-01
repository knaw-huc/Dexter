import React from "react"
import { ServerSource } from "../../Model/DexterModel"
import { KeywordContent } from "../keywords/KeywordContent"
import { LanguagesContent } from "../languages/LanguagesContent"

interface SourceItemDropdownContentProps {
    source: ServerSource | undefined
}

export const SourceItemDropdownContent = (props: SourceItemDropdownContentProps) => {


    return (
        <>
            {props.source && <div id="source-content">
                <p><strong>External reference:</strong> {props.source.externalRef}</p>
                <p><strong>Title:</strong> {props.source.title}</p>
                <p><strong>Description:</strong> {props.source.description}</p>
                <p><strong>Rights:</strong> {props.source.rights}</p>
                <p><strong>Access:</strong> {props.source.access}</p>
                <p><strong>Location:</strong> {props.source.location}</p>
                <p><strong>Earliest:</strong> {props.source.earliest}</p>
                <p><strong>Latest:</strong> {props.source.latest}</p>
                <p><strong>Notes:</strong> {props.source.notes}</p>
                <div><strong>Keywords:</strong> <KeywordContent sourceId={props.source.id} /></div>
                <div><strong>Languages:</strong> <LanguagesContent sourceId={props.source.id} /></div>
            </div>}
        </>
    )
}