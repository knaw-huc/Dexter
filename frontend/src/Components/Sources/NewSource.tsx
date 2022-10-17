import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import styled from "@emotion/styled"
import { createSource, getSourceById, updateSource } from "../API"
import { Sources } from "../../Model/DexterModel"

type NewSourceProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    sourceToEdit?: Sources,
    onEdit?: (boolean: boolean) => void,
    refetchSource?: () => void
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

export function NewSource(props: NewSourceProps) {
    const { register, handleSubmit, reset, setValue } = useForm<Sources>()
    const onSubmit: SubmitHandler<Sources> = async data => {
        if (!props.edit) {
            try {
                await createSource(data)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
            props.onClose()
        } else {
            const doUpdateSource = async (id: string, updatedData: Sources) => {
                try {
                    await updateSource(id, updatedData)
                    await props.refetchSource()
                } catch (error) {
                    console.log(error)
                }
            }
            doUpdateSource(props.sourceToEdit.id, data)
            props.onClose()
        }
    }

    React.useEffect(() => {
        const doGetSourceById = async (id: string) => {
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
                        <Label>External reference</Label>
                        <Input {...register("externalRef")} />
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
                        <Label>Notes</Label>
                        <Input {...register("notes")} />
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