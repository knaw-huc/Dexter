import React from "react"

export function ShortFieldsSummary<T>(props: {
        fieldNames: (keyof T)[],
        resource: T
    }
) {
    return <p style={{textTransform: "capitalize"}}>
        {props.fieldNames.map((field: keyof T, i) => [
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
        <span style={{textTransform: "lowercase", color: "grey"}}>{label}:</span>
        {" "}
        <strong>{value}</strong>
    </span>
}

export function Spacer() {
    return <span style={{display: "inline-block", color: "grey", margin: "0.75em"}}> | </span>
}