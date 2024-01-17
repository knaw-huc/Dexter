import {ServerKeyword} from "../../model/DexterModel"
import {Stack} from "@mui/material"
import {KeywordChip} from "./KeywordChip"
import React from "react"

export function KeywordList(props: {
    keywords: ServerKeyword[]
    sx?: any
    onDelete?: (keyword: ServerKeyword) => void
}) {
    return <Stack
        spacing={1}
        direction="row"
        sx={{
            ...props.sx,
            m: "0"
        }}
    >
        {props.keywords?.map((keyword: ServerKeyword, index: number) => (
            props.onDelete
                ? <KeywordChip
                    key={index}
                    keyword={keyword}
                    onDelete={() => props.onDelete && props.onDelete(keyword)}
                />
                : <KeywordChip
                    key={index}
                    keyword={keyword}
                />
        ))}
    </Stack>
}