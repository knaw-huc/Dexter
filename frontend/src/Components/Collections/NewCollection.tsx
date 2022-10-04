import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import styled from "styled-components"
import { createCollection, getCollectionById, updateCollection } from "../API"
import { Collections } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"

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
    const { collectionsState } = React.useContext(collectionsContext)
    const { register, handleSubmit, reset, setValue, watch } = useForm<Collections>()
    const onSubmit: SubmitHandler<Collections> = async data => {
        if (!props.edit) {
            data.lastupdated = new Date()
            data.user = "Sebastiaan"
            data.creation = new Date()
            data.sources = []
            if (data.mainorsub === "Main collection") {
                data.subCollections = []
            }
            try {
                await createCollection(data)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
            props.onClose()
        } else {
            const doUpdateCollection = async (id: number, updatedData: Collections) => {
                try {
                    updatedData.lastupdated = new Date()
                    await updateCollection(id, updatedData)
                    await props.refetchCol()
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
            const fields = ["title", "description", "mainorsub", "creator", "subject", "rights", "access", "created", "spatial", "temporal", "language", "subCollections"]
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

    const mainOrSub = watch("mainorsub")

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
                            <option value="Main collection">Main collection</option>
                            <option value="Sub collection">Sub collection</option>
                        </Select>
                        {mainOrSub === "Sub collection" && (
                            <>
                                <Label>Part of which collection?</Label>
                                <Select {...register("subCollections")}>
                                    {collectionsState.collections.map((collection, i) => {
                                        return <option value={collection.id} key={i}>{collection.id} {collection.title}</option>
                                    })}
                                </Select>
                            </>
                        )}
                        <Label>Creator</Label>
                        <Input {...register("creator", { required: true })} />
                        <Label>Subject</Label>
                        <Input {...register("subject", { required: true })} />
                        <Label>Rights</Label>
                        <Input {...register("rights", { required: true })} />
                        <Label>Access</Label>
                        <Select {...register("access", { required: true })}>
                            <option value="Open">Open</option>
                            <option value="Restricted">Restricted</option>
                            <option value="Closed">Closed</option>
                        </Select>
                        <Label>Created</Label>
                        <Input {...register("created", { required: true })} />
                        <Label>Spatial</Label>
                        <Input {...register("spatial")} />
                        <Label>Temporal</Label>
                        <Input {...register("temporal")} />
                        <Label>Language</Label>
                        <Input {...register("language")} />
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