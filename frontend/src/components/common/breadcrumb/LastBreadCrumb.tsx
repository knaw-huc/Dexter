import Typography from "@mui/material/Typography"
import React from "react"

export function LastBreadCrumb(props: {text: string}) {
    return <Typography>
        {props.text}
    </Typography>
}