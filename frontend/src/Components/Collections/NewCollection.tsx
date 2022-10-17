import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import styled from "@emotion/styled"
import { createCollection, getCollectionById, updateCollection } from "../API"
import { Collections } from "../../Model/DexterModel"
import { Languages } from "./Languages"

type NewCollectionProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    colToEdit?: Collections,
    onEdit?: (boolean: boolean) => void,
    refetchCol?: () => void
}

const Input = styled.input`
    display: block;
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    border: 1px solid black;
    padding: 10px 15px;
    margin-bottom: 10px;
`

const Textarea = styled.textarea`
    display: block;
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    border: 1px solid black;
    padding: 10px 15px;
    margin-bottom: 10px;
`

const Label = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
`

const Select = styled.select`
    display: block;
    margin-bottom: 10px;
`

export function NewCollection(props: NewCollectionProps) {
    const { register, handleSubmit, reset, setValue, control } = useForm<Collections>()
    const onSubmit: SubmitHandler<Collections> = async data => {
        if (!props.edit) {
            try {
                await createCollection(data)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
            props.onClose()
        } else {
            const doUpdateCollection = async (id: string, updatedData: Collections) => {
                try {
                    await updateCollection(id, updatedData)
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
            const response: any = await getCollectionById(id)
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
            <Modal size="lg" show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new collection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Label>Title</Label>
                        <Input {...register("title", { required: true })} />
                        <Label>Description</Label>
                        <Textarea rows={6} {...register("description", { required: true })} />
                        <Label>Rights</Label>
                        <Input {...register("rights", { required: true })} />
                        <Label>Access</Label>
                        <Select {...register("access", { required: true })}>
                            <option value="Open">Open</option>
                            <option value="Restricted">Restricted</option>
                            <option value="Closed">Closed</option>
                        </Select>
                        <Label>Location</Label>
                        <Input {...register("location")} />
                        <Label>Earliest</Label>
                        <Input {...register("earliest")} />
                        <Label>Latest</Label>
                        <Input {...register("latest")} />
                        <Label>Contributor</Label>
                        <Input {...register("contributor")} />
                        <Label>Notes</Label>
                        <Input {...register("notes")} />
                        <Label>Language</Label>
                        <Languages control={control} />
                        <Button type="submit">Submit</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button type="submit" onClick={handleClose}>
                        Submit
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    )
}