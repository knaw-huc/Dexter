import styled from "@emotion/styled"
import { yupResolver } from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import React from "react"
import Modal from "react-bootstrap/Modal"
import { SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { ServerCorpus, ServerKeyword, ServerLanguage, ServerSource } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { addKeywordsToCorpus, addLanguagesToCorpus, addSourcesToCorpus, createCollection, getCollectionById, getKeywordsCorpora, getLanguagesCorpora, getSourcesInCorpus, updateCollection } from "../API"
import { KeywordsField } from "../keywords/KeywordsField"
import { LanguagesField } from "../languages/LanguagesField"
import { PartOfSourceField } from "./PartOfSourceField"
import { SubCorpusField } from "./SubCorpusField"

type NewCollectionProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    colToEdit?: ServerCorpus | undefined,
    onEdit?: (boolean: boolean) => void,
    refetchCol?: () => void
}

const TextFieldStyled = styled(TextField)`
    display: block;
`

const Label = styled.label`
    font-weight: bold;
`

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    rights: yup.string().required("Rights is required"),
    access: yup.string().required("Access is required")
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
    if (newData.parentId) {
        newData.parentId = newData.parentId.map((corpus: ServerCorpus) => { return corpus.id }).toString()
    }
    return newData
}

export function NewCollection(props: NewCollectionProps) {
    const { sourcesState } = React.useContext(sourcesContext)
    const { collectionsState } = React.useContext(collectionsContext)
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<ServerCorpus>({ resolver: yupResolver(schema), mode: "onBlur", defaultValues: { keywords: [], languages: [], sourceIds: [], parentId: null, access: null } })
    const onSubmit: SubmitHandler<ServerCorpus> = async data => {
        console.log(data)

        if (!props.edit) {
            const dataToServer = formToServer(data)
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
            const updatedDataToServer: any = data
            if (updatedDataToServer.keywords) {
                updatedDataToServer.keywords = updatedDataToServer.keywords.map((kw: ServerKeyword) => { return kw.id })
            }

            if (updatedDataToServer.languages) {
                updatedDataToServer.languages = updatedDataToServer.languages.map((language: ServerLanguage) => { return language.id })
            }

            if (updatedDataToServer.sourceIds) {
                updatedDataToServer.sourceIds = updatedDataToServer.sourceIds.map((source: ServerSource) => { return source.id })
            }

            if (updatedDataToServer.parentId) {
                updatedDataToServer.parentId = updatedDataToServer.parentId.id
            }

            const doUpdateCollection = async (id: string, updatedData: ServerCorpus) => {
                try {
                    await updateCollection(id, updatedData)
                    await addKeywordsToCorpus(id, updatedDataToServer.keywords)
                    await addLanguagesToCorpus(id, updatedDataToServer.languages)
                    await addSourcesToCorpus(id, updatedDataToServer.sourceIds)
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
            const data: any = await getCollectionById(id)
            const keywords = await getKeywordsCorpora(id)
            const languages = await getLanguagesCorpora(id)
            const sources = await getSourcesInCorpus(id)

            data.keywords = keywords.map((keyword) => { return keyword })
            data.languages = languages.map((language) => { return language })
            data.sourceIds = sources.map((source) => { return source })

            const parentId = data.parentId
            data.parentId = await getCollectionById(parentId)

            const fields = ["parentId", "title", "description", "rights", "access", "location", "earliest", "latest", "contributor", "notes", "keywords", "languages", "sourceIds"]
            fields.map((field: any) => {
                setValue(field, data[field])
            })
        }

        if (props.edit && props.colToEdit) {
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
                        <TextFieldStyled fullWidth margin="dense" error={errors.title ? true : false} {...register("title")} />
                        <p style={{ color: "red" }}>{errors.title?.message}</p>
                        <Label>Description</Label>
                        <TextFieldStyled fullWidth margin="dense" multiline rows={6} error={errors.description ? true : false} {...register("description", { required: true })} />
                        <p style={{ color: "red" }}>{errors.description?.message}</p>
                        <Label>Rights</Label>
                        <TextFieldStyled fullWidth margin="dense" error={errors.rights ? true : false} {...register("rights", { required: true })} />
                        <p style={{ color: "red" }}>{errors.rights?.message}</p>
                        <Label>Access</Label>
                        <TextFieldStyled
                            error={errors.access ? true : false}
                            select
                            fullWidth
                            defaultValue=""
                            inputProps={register("access", { required: true })}
                        >
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="Restricted">Restricted</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                        </TextFieldStyled>
                        <p style={{ color: "red" }}>{errors.access?.message}</p>
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
                        <KeywordsField control={control} corpusId={props.colToEdit && props.colToEdit.id} setValueCorpus={setValue} edit={collectionsState.editColMode} />
                        <Label>Languages</Label>
                        <LanguagesField control={control} corpusId={props.colToEdit && props.colToEdit.id} setValueCorpus={setValue} edit={collectionsState.editColMode} />
                        <Label>Add sources to corpus</Label>
                        <PartOfSourceField control={control} sources={sourcesState.sources} corpusId={props.colToEdit && props.colToEdit.id} setValue={setValue} edit={collectionsState.editColMode} />
                        <Label>Add corpus to which main corpus?</Label>
                        <SubCorpusField control={control} corpora={collectionsState.collections} />
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