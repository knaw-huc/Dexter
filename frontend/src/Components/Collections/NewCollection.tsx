import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"
import { addKeywordsToCorpus, addLanguagesToCorpus, addSourcesToCorpus, createCollection, getCollectionById, updateCollection } from "../API"
import { ServerCorpus, ServerKeyword, ServerLanguage, ServerSource } from "../../Model/DexterModel"
import TextField from "@mui/material/TextField"
import { KeywordsField } from "../keywords/KeywordsField"
import { LanguagesField } from "../languages/LanguagesField"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { PartOfSourceField } from "./PartOfSourceField"
import { sourcesContext } from "../../State/Sources/sourcesContext"

type NewCollectionProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    colToEdit?: ServerCorpus,
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

const schema = yup.object({
    title: yup.string().required(),

})

const formToServer = (data: ServerCorpus) => {
    const newData: any = data
    if (newData.keywords) {
        newData.keywords = newData.keywords.map((kw: ServerKeyword) => { return kw.id })
    }
    if (newData.languages) {
        newData.languages = newData.languages.map((language: ServerLanguage) => { return language.id })
    }
    if (newData.sourceIds) {
        newData.sourceIds = newData.sourceIds.map((source: ServerSource) => { return source.id })
    }
    return newData
}

export function NewCollection(props: NewCollectionProps) {
    const { sourcesState } = React.useContext(sourcesContext)
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<ServerCorpus>({ resolver: yupResolver(schema) })
    const onSubmit: SubmitHandler<ServerCorpus> = async data => {
        console.log(data)

        const dataToServer = formToServer(data)

        if (!props.edit) {
            try {
                const newCollection = await createCollection(dataToServer)
                const corpusId = newCollection.id
                dataToServer.keywords && await addKeywordsToCorpus(corpusId, dataToServer.keywords)
                dataToServer.languages && await addLanguagesToCorpus(corpusId, dataToServer.languages)
                dataToServer.sourceIds && await addSourcesToCorpus(corpusId, dataToServer.sourceIds)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
            props.onClose()
        } else {
            const doUpdateCollection = async (id: string, updatedData: ServerCorpus) => {
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
                        <TextFieldStyled fullWidth margin="dense" {...register("title")} />
                        <p>{errors.title?.message}</p>
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
                        <Label>Keywords</Label>
                        <KeywordsField control={control} />
                        <Label>Languages</Label>
                        <LanguagesField control={control} />
                        <Label>Add sources to corpus</Label>
                        <PartOfSourceField control={control} sources={sourcesState.sources} />
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