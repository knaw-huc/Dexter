import React from "react"
import {PropsWithChildren} from "react"
import {Box, Modal} from "@mui/material"

const modalStyle = {
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    overflow: "scroll",
    height: "100%",
    display: "block"
}

type ScrollModalProps = PropsWithChildren & {
    show: boolean,
    handleClose: () => void
}

export default function ScrollableModal(props: ScrollModalProps) {
    return <Modal
        open={props.show}
        onClose={props.handleClose}
    >
        <Box sx={modalStyle}>
            {props.children}
        </Box>
    </Modal>
}