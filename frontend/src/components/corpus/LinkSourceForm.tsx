import Button from "@mui/material/Button"
import React from "react"
import ScrollableModal from "../common/ScrollableModal"
import {LinkSourceField, LinkSourceFieldProps} from "./LinkSourceField"

export type LinkSourceFormProps = LinkSourceFieldProps & {
    onClose: () => void
};

export function LinkSourceForm(props: LinkSourceFormProps) {
    return <ScrollableModal
        show={true}
        handleClose={props.onClose}
        fullHeight={false}
    >
        <LinkSourceField
            {...props}
        />
        <Button
            variant="contained"
            onClick={props.onClose}
        >
            Close
        </Button>
    </ScrollableModal>
}

