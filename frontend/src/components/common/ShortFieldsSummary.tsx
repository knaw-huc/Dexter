import React from "react"
import {grey} from "@mui/material/colors"

export function ShortFieldsSummary<T>(props: {
        fieldNames: (keyof T)[],
        resource: T
    }
) {
    const fieldsToShow = props.fieldNames
        .filter(name => props.resource[name])
    return <p style={{textTransform: "capitalize"}}>
        {fieldsToShow.map((field: keyof T, i) => [
            i > 0 && <Spacer key={`spacer-${i}`}/>,
            <ShortField<T>
                key={i}
                fieldName={field}
                resource={props.resource}
            />
        ])}
    </p>
}

export function ShortField<T>(
    props: {
        fieldName: keyof T,
        resource: T
    }
) {
    const value = String(props.resource[props.fieldName])
    if (!value) {
        return null
    }
    const label = String(props.fieldName)
    return <span>
        <FieldLabel label={label}/>
        {" "}
        <strong>{value}</strong>
    </span>
}

export function FieldLabel(props: { label: string }) {
    return <span style={{color: grey[600]}}>{props.label}:{" "}</span>
}

export function Spacer() {
    return <span style={{display: "inline-block", color: "grey", margin: "0.75em"}}> | </span>
}