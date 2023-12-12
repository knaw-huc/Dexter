import React, {useContext, useEffect} from "react"
import {useForm} from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"
import {createSource, getSourceById, updateSource} from "../API"
import {Access, Source} from "../../Model/DexterModel"
import TextField from "@mui/material/TextField"
import {errorContext} from "../../State/Error/errorContext"

type NewSourceProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    sourceToEdit?: Source,
    onEdit?: (boolean: boolean) => void,
    refetchSource?: () => void
}

const TextFieldStyled = styled(TextField)`
  display: block;
`

const Label = styled.label`
  font-weight: bold;
`

const Select = styled.select`
  display: block;
`

export function SourceForm(props: NewSourceProps) {
    const {register, handleSubmit, reset, setValue} = useForm<Source>()
    const {updateError} = useContext(errorContext)

    async function onSubmit(data: Source) {
        if (props.edit) {
            await handleUpdate(data)
        } else {
            await handleCreate(data)
        }
    }

    async function handleUpdate(data: Source) {
        await updateSource(props.sourceToEdit.id, data)
            .catch(updateError)
        props.refetchSource()
    }

    async function handleCreate(data: Source) {
        await createSource(data)
        props.refetch()
        props.onClose()
    }

    useEffect(() => {
        initSourceForm(props.sourceToEdit.id)

        async function initSourceForm(id: string) {
            if (!props.edit) {
                return
            }
            getSourceById(id)
                .then(reset)
                .catch(updateError)
        }
    }, [props.edit, setValue])

    const handleClose = () => {
        props.onClose()
        if (props.edit) {
            props.onEdit(false)
        }
        reset()
    }

    console.log("enum", Access)
    console.log("values", Object.values(Access))
    console.log("keys", Object.keys(Access))
    return <>
        <Modal size="lg" show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Label>External reference</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("externalRef")} />
                    <Label>Title</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("title", {required: true})} />
                    <Label>Description</Label>
                    <TextFieldStyled fullWidth margin="dense" multiline rows={6} {...register("description", {required: true})} />
                    <Label>Rights</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("rights", {required: true})} />
                    <Label>Access</Label>
                    <Select {...register("access", {required: true})}>
                        <option value="open">Open</option>
                        <option value="restricted">Restricted</option>
                        <option value="closed">Closed</option>
                    </Select>
                    <Label>Location</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("location")} />
                    <Label>Earliest</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("earliest")} />
                    <Label>Latest</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("latest")} />
                    <Label>Notes</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                    <Button variant="contained" type="submit">Submit</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="contained" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}