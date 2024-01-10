import {ServerResultCorpus} from "../../model/DexterModel"
import React from "react"

export function SourceField(
    props: {
        fieldName: keyof ServerResultCorpus,
        resource: ServerResultCorpus
    }
) {
    const value = String(props.resource[props.fieldName])
    if (!value) {
        return null
    }
    const label = String(props.fieldName)
    return <span>
        <span style={{textTransform: "lowercase", color: "grey"}}>{label}:</span>
        {" "}
        <strong>{value}</strong>
    </span>
}