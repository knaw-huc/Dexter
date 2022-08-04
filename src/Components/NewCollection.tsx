import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import styled from "styled-components"
import { createCollection, getCollectionById, updateCollection } from "./API"
import { IFormInput } from "../Model/DexterModel"

type NewCollectionProps = {
    refetch?: any,
    show?: any,
    onClose?: any,
    edit?: any,
    colToEdit?: any,
    onEdit?: any
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
    const { register, handleSubmit, reset, setValue } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = async data => {
        if (!props.edit) {
            data.lastupdated = new Date()
            data.user = "test"
            data.creation = new Date()
            try {
                await createCollection(data)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
        } else {
            const doUpdateCollection = async (id: any, updatedData: any) => {
                try {
                    const result = await updateCollection(id, updatedData)
                    console.log(result)
                    await props.refetch()
                } catch (error) {
                    console.log(error)
                }
            }
            doUpdateCollection(props.colToEdit.id - 1, data)
            props.onClose()
        }
    }

    React.useEffect(() => {
        const doGetCollectionById = async (id: number) => {
            const response: any = await getCollectionById(id)
            console.log(response)
            const fields = ["title", "description", "mainorsub", "creator", "subject", "rights", "access", "created", "spatial", "temporal", "language"]
            fields.map((field: any) => {
                setValue(field, response[field])
            })
        }

        if (props.edit) {
            doGetCollectionById(props.colToEdit.id)

        } else {
            return
        }
    }, [props.colToEdit.id, props.edit, setValue])

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
                        <Label>Main or sub collection?</Label>
                        <Select {...register("mainorsub", { required: true })}>
                            <option value="maincollection">Main collection</option>
                            <option value="subcollection">Sub collection</option>
                        </Select>
                        <Label>Creator</Label>
                        <Input {...register("creator", { required: true })} />
                        <Label>Subject</Label>
                        <Input {...register("subject", { required: true })} />
                        <Label>Rights</Label>
                        <Input {...register("rights", { required: true })} />
                        <Label>Access</Label>
                        <Select {...register("access", { required: true })}>
                            <option value="open">Open</option>
                            <option value="restricted">Restricted</option>
                            <option value="closed">Closed</option>
                        </Select>
                        <Label>Created</Label>
                        <Input {...register("created", { required: true })} />
                        <Label>Spatial</Label>
                        <Input {...register("spatial")} />
                        <Label>Temporal</Label>
                        <Input {...register("temporal")} />
                        <Label>Language</Label>
                        <Input {...register("language")} />
                        <input type="submit" />
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