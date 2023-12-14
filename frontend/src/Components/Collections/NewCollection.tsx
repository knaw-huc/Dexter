import React, {useContext} from "react"
import {useForm, SubmitHandler} from "react-hook-form"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"
import {createCollection, getCollectionById, updateCollection} from "../../utils/API"
import {Collections} from "../../Model/DexterModel"
import TextField from "@mui/material/TextField"
import {errorContext} from "../../State/Error/errorContext"
import {Box, Modal} from "@mui/material"
import ScrollableModal from "../Common/ScrollableModal"

type NewCollectionProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    colToEdit?: Collections,
    onEdit?: (boolean: boolean) => void,
    refetchCol?: () => void
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

export function NewCollection(props: NewCollectionProps) {
    const {register, handleSubmit, reset, setValue} = useForm<Collections>()
    const {setError} = useContext(errorContext)

    const onSubmit: SubmitHandler<Collections> = async data => {
        if (!props.edit) {
            await createCollection(data)
                .catch(setError)
            await props.refetch()
            props.onClose()
        } else {
            const doUpdateCollection = async (id: string, updatedData: Collections) => {
                try {
                    await updateCollection(id, updatedData)
                        .catch(setError)
                    await props.refetchCol()
                } catch (error) {
                    console.log(error)
                }
            }
            doUpdateCollection(props.colToEdit.id, data)
            props.onClose()
        }
    }

    React.useEffect(() => {
        const doGetCollectionById = async (id: string) => {
            const response: any = await getCollectionById(id).catch(setError)
            console.log(response)
            const fields = ["title", "description", "rights", "access", "location", "earliest", "latest", "contributor", "notes"]
            fields.map((field: any) => {
                setValue(field, response[field])
            })
        }

        if (props.edit) {
            doGetCollectionById(props.colToEdit.id)

        } else {
            return
        }
    }, [props.edit, setValue])

    const handleClose = () => {
        props.onClose()

        if (props.edit) {
            props.onEdit(false)
        }

        reset() //Should later be moved to a useEffect
    }

    return (
        <>
            <ScrollableModal
                show={props.show}
                handleClose={handleClose}
            >
                <h1>Create new corpus</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Label>Title</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("title", {required: true})} />
                    <Label>Description</Label>
                    <TextFieldStyled fullWidth margin="dense" multiline rows={6} {...register("description", {required: true})} />
                    <Label>Rights</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("rights", {required: true})} />
                    <Label>Access</Label>
                    <Select {...register("access", {required: true})}>
                        <option value="Open">Open</option>
                        <option value="Restricted">Restricted</option>
                        <option value="Closed">Closed</option>
                    </Select>
                    <Label>Location</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("location")} />
                    <Label>Earliest</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("earliest")} />
                    <Label>Latest</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("latest")} />
                    <Label>Contributor</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("contributor")} />
                    <Label>Notes</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                    {/* <Label>Language</Label>
                        <Languages control={control} /> */}
                    <Button variant="contained" type="submit">Submit</Button>
                </form>
                <Button variant="contained" onClick={handleClose}>
                    Close
                </Button>
            </ScrollableModal>
        </>
    )
}