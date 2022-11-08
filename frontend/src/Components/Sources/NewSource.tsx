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
import { addKeywordsToSource, addLanguagesToSource, createSource, getKeywordsSources, getSourceById, updateSource } from "../API"
import { KeywordsField } from "../keywords/KeywordsField"
import { LanguagesField } from "../languages/LanguagesField"
import { PartOfCorpusField } from "./PartOfCorpusField"

type NewSourceProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    sourceToEdit?: ServerSource | undefined,
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

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    rights: yup.string().required("Rights is required"),
    access: yup.string().required("Access is required")
})

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

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<ServerSource>({ resolver: yupResolver(schema), mode: "onBlur", defaultValues: { keywords: [], languages: [] } })
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
            const data: any = await getSourceById(id)
            const keywords = await getKeywordsSources(id)

            data.keywords = keywords.map((keyword) => { return keyword })

            const fields = ["externalRef", "title", "description", "rights", "access", "location", "earliest", "latest", "notes", "keywords"]
            fields.map((field: any) => {
                setValue(field, data[field])
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
                        <TextFieldStyled fullWidth margin="dense" error={errors.title ? true : false} {...register("title", { required: true })} />
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
                        <Label>Notes</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                        <Label>Keywords</Label>
                        <KeywordsField control={control} sourceId={props.sourceToEdit && props.sourceToEdit.id} setValueSource={setValue} />
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