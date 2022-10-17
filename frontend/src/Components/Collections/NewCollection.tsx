import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
// import styled from "styled-components"
import { createCollection, getCollectionById, updateCollection } from "../API"
import { Collections } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"
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

// const input = styled.input`
//     display: block;
//     box-sizing: border-box;
//     width: 100%;
//     border-radius: 4px;
//     border: 1px solid black;
//     padding: 10px 15px;
//     margin-bottom: 10px;
// `

// const textarea = styled.textarea`
//     display: block;
//     box-sizing: border-box;
//     width: 100%;
//     border-radius: 4px;
//     border: 1px solid black;
//     padding: 10px 15px;
//     margin-bottom: 10px;
// `

// const label = styled.label`
//     font-weight: bold;
//     margin-bottom: 5px;
// `

// const select = styled.select`
//     display: block;
//     margin-bottom: 10px;
// `

export function NewCollection(props: NewCollectionProps) {
    const { collectionsState } = React.useContext(collectionsContext)
    const { register, handleSubmit, reset, setValue, watch, control } = useForm<Collections>()
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
                        <label>Title</label>
                        <input {...register("title", { required: true })} />
                        <label>Description</label>
                        <textarea rows={6} {...register("description", { required: true })} />
                        <label>Main or sub collection?</label>
                        <select {...register("mainorsub", { required: true })}>
                            <option value="Main collection">Main collection</option>
                            <option value="Sub collection">Sub collection</option>
                        </select>
                        {mainOrSub === "Sub collection" && (
                            <>
                                <label>Part of which collection?</label>
                                <select {...register("subCollections")}>
                                    {collectionsState.collections.map((collection, i) => {
                                        return <option value={collection.id} key={i}>{collection.id} {collection.title}</option>
                                    })}
                                </select>
                            </>
                        )}
                        <label>Creator</label>
                        <input {...register("creator", { required: true })} />
                        <label>Subject</label>
                        <input {...register("subject", { required: true })} />
                        <label>Rights</label>
                        <input {...register("rights", { required: true })} />
                        <label>Access</label>
                        <select {...register("access", { required: true })}>
                            <option value="Open">Open</option>
                            <option value="Restricted">Restricted</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <label>Created</label>
                        <input {...register("created", { required: true })} />
                        <label>Spatial</label>
                        <input {...register("spatial")} />
                        <label>Temporal</label>
                        <input {...register("temporal")} />
                        <label>Language</label>
                        <Languages control={control} />
                        {/* <input {...register("language")} /> */}
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