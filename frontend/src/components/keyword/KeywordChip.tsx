import {ServerKeyword} from "../../model/DexterModel"
import Chip from "@mui/material/Chip"
import React from "react"

export function KeywordChip(props: {
    keyword: ServerKeyword,
    onDelete?: () => void,
}) {
    return <Chip
        label={props.keyword.val}
        variant="outlined"
        onDelete={props.onDelete}
        sx={{pr: "0.25em"}}
        size="small"
    />
}