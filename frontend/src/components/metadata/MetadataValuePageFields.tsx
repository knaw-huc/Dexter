import React from "react"
import {MetadataValue} from "../../model/DexterModel"
import {Label} from "../common/Label"
import styled from "@emotion/styled"

type MetadataValuePageFieldsProps = {
    values: MetadataValue[]
}

const MetadataValue = styled.p`
  margin-top: 0;
`
export function MetadataValuePageFields(props: MetadataValuePageFieldsProps) {

    return <>
        <h2>Custom Metadata</h2>
        {props.values.map((value, i) => <div key={i}>
            <Label>{value.key.key}</Label>
            <MetadataValue>{value.value}</MetadataValue>
        </div>)}
    </>
}