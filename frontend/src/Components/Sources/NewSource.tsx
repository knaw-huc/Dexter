import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
// import styled from "styled-components"
import { createSource, getSourceById, updateSource } from "../API"
import { Sources } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"

type NewSourceProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    sourceToEdit?: Sources,
    onEdit?: (boolean: boolean) => void,
    refetchSource?: () => void
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

export function NewSource(props: NewSourceProps) {
    const { collectionsState } = React.useContext(collectionsContext)
    const { register, handleSubmit, reset, setValue } = useForm<Sources>()
    const onSubmit: SubmitHandler<Sources> = async data => {
        if (!props.edit) {
            data.lastupdated = new Date()
            data.user = "test"
            data.creation = new Date()
            try {
                await createSource(data)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
            props.onClose()
        } else {
            const doUpdateSource = async (id: number, updatedData: Sources) => {
                try {
                    await updateSource(id, updatedData)
                    await props.refetchSource()
                } catch (error) {
                    console.log(error)
                }
            }
            doUpdateSource(props.sourceToEdit.id - 1, data)
            props.onClose()
        }
    }

    React.useEffect(() => {
        const doGetSourceById = async (id: number) => {
            const response: any = await getSourceById(id)
            console.log(response as Sources)
            const fields = ["title", "description", "creator", "subject", "rights", "access", "created", "spatial", "temporal", "language"]
            fields.map((field: any) => {
                setValue(field, response[field])
            })
        }

        if (props.edit) {
            doGetSourceById(props.sourceToEdit.id)

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
                    <Modal.Title>Create new source</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Title</label>
                        <input {...register("title", { required: true })} />
                        <label>Description</label>
                        <textarea rows={6} {...register("description", { required: true })} />
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
                        <input {...register("language")} />
                        <label>Part of which collection?</label>
                        <select {...register("partCol", { setValueAs: v => v.split() })}>
                            {collectionsState.collections.map((collection, i) => {
                                return <option value={collection.id} key={i}>{collection.id} {collection.title}</option>
                            })}
                        </select>
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