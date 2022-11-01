import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Modal from "react-bootstrap/Modal"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"
import { addKeywordsToSource, addLanguagesToSource, createSource, getSourceById, updateSource } from "../API"
import { ServerCorpus, ServerKeyword, ServerLanguage, ServerSource } from "../../Model/DexterModel"
import TextField from "@mui/material/TextField"
import { KeywordsField } from "../keywords/KeywordsField"
import { LanguagesField } from "../languages/LanguagesField"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { MenuItem } from "@mui/material"
import Select from "@mui/material/Select"
import { PartOfCorpusField } from "./PartOfCorpusField"

type NewSourceProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    sourceToEdit?: ServerSource,
    onEdit?: (boolean: boolean) => void,
    refetchSource?: () => void
}

const TextFieldStyled = styled(TextField)`
    display: block;
`

const Label = styled.label`
    font-weight: bold;
`

const SelectStyled = styled.select`
    display: block;
`

const formToServer = (data: ServerSource) => {
    const newData: any = data
    if (newData.keywords) {
        newData.keywords = newData.keywords.map((kw: ServerKeyword) => { return kw.id })
    }
    if (newData.languages) {
        newData.languages = newData.languages.map((language: ServerLanguage) => { return language.id })
    }
    if (newData.partOfCorpus) {
        newData.partOfCorpus = newData.partOfCorpus.map((corpus: ServerCorpus) => { return corpus.id })
    }

    console.log(newData)
    return newData
}

export function NewSource(props: NewSourceProps) {
    const { collectionsState } = React.useContext(collectionsContext)

    const { register, handleSubmit, reset, setValue, control } = useForm<ServerSource>()
    const onSubmit: SubmitHandler<ServerSource> = async data => {
        console.log(data)

        const dataToServer = formToServer(data)

        if (!props.edit) {
            try {
                const newSource = await createSource(dataToServer)
                const sourceId = newSource.id
                dataToServer.keywords && await addKeywordsToSource(sourceId, dataToServer.keywords)
                dataToServer.languages && await addLanguagesToSource(sourceId, dataToServer.languages)
                await props.refetch()
            } catch (error) {
                console.log(error)
            }
            props.onClose()
        } else {
            const doUpdateSource = async (id: string, updatedData: ServerSource) => {
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
            console.log(response as ServerSource)
            const fields = ["externalRef", "title", "description", "rights", "access", "location", "earliest", "latest", "notes"]
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
                        <TextFieldStyled fullWidth margin="dense" {...register("externalRef")} />
                        <Label>Title</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("title", { required: true })} />
                        <Label>Description</Label>
                        <TextFieldStyled fullWidth margin="dense" multiline rows={6} {...register("description", { required: true })} />
                        <Label>Rights</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("rights", { required: true })} />
                        <Label>Access</Label>
                        <SelectStyled {...register("access", { required: true })}>
                            <option value="Open">Open</option>
                            <option value="Restricted">Restricted</option>
                            <option value="Closed">Closed</option>
                        </SelectStyled>
                        <Label>Location</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("location")} />
                        <Label>Earliest</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("earliest")} />
                        <Label>Latest</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("latest")} />
                        <Label>Notes</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                        <Label>Keywords</Label>
                        <KeywordsField control={control} />
                        <Label>Languages</Label>
                        <LanguagesField control={control} />
                        <Label>Part of which corpus?</Label>
                        <PartOfCorpusField control={control} corpora={collectionsState.collections} />
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