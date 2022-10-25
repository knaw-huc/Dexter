import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"
import { addKeywordsToCorpus, addLanguagesToCorpus, createCollection, getCollectionById, updateCollection } from "../API"
import { Collections, Keywords, Languages, Sources } from "../../Model/DexterModel"
// import { Languages } from "./Languages"
import TextField from "@mui/material/TextField"
import { KeywordsField } from "../keywords/KeywordsField"
import { LanguagesField } from "../languages/LanguagesField"

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
    const { register, handleSubmit, reset, setValue, control } = useForm<Collections | Keywords | Sources | Languages>()
    const onSubmit: SubmitHandler<Collections> = async data => {
        console.log(data)

        const keywordIds = data.val && data.val.map((keyword) => { return keyword.id })

        const languageIds = data.refName && data.refName.map((language) => { return language.id })

        if (!props.edit) {
            try {
                const newCollection = await createCollection(data)
                const corpusId = newCollection.id
                keywordIds && await addKeywordsToCorpus(corpusId, keywordIds)
                languageIds && await addLanguagesToCorpus(corpusId, languageIds)
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
                    <Modal.Title>Create new corpus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Label>Title</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("title", { required: true })} />
                        <Label>Description</Label>
                        <TextFieldStyled fullWidth margin="dense" multiline rows={6} {...register("description", { required: true })} />
                        <Label>Rights</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("rights", { required: true })} />
                        <Label>Access</Label>
                        <Select {...register("access", { required: true })}>
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
                        <Label>Keywords</Label>
                        <KeywordsField control={control} />
                        <Label>Languages</Label>
                        <LanguagesField control={control} />
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" onClick={handleClose}>
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