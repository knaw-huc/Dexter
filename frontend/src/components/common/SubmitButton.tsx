import Button from "@mui/material/Button"
import React from "react"

export function SubmitButton(props: {onClick?: () => void}) {
    return <Button
        variant="contained"
        type={props.onClick ? "button" : "submit"}
        style={{marginTop: "1em"}}
        onClick={props.onClick}
    >
        Submit
    </Button>
}