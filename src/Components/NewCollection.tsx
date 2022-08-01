import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import styled from "styled-components"

enum AccessEnum {
    open = "open",
    restricted = "restricted",
    closed = "closed"
}

interface IFormInput {
    id: string,
    title: string,
    description: string,
    mainorsub: {
        maincollection: string,
        subcollection: string,
    },
    creator: string,
    subject: string,
    rights: string,
    access: AccessEnum,
    created: Date,
    spatial: string,
    temporal: string,
    language: string,
    lastupdated: Date,
    user: string,
    creation: Date
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

export function NewCollection() {
    const [show, setShow] = React.useState(false)
    const { register, handleSubmit, reset } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = data => {
        data.lastupdated = new Date()
        data.user = "test"
        data.creation = new Date()
        localStorage.setItem("form", JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem("form")))
    }

    const handleClose = () => {
        setShow(false)
        reset() //Should later be moved to a useEffect
    }
    const handleShow = () => setShow(true)

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create new collection
            </Button>
            <Modal size="lg" show={show} onHide={handleClose}>
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
                    <Button type="submit" onClick={handleClose}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}