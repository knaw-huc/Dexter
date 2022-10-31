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

const Select = styled.select`
    display: block;
`

export function NewSource(props: NewSourceProps) {
    const { collectionsState } = React.useContext(collectionsContext)

    const { register, handleSubmit, reset, setValue, control } = useForm<ServerSource | ServerKeyword | ServerCorpus | ServerLanguage>()
    const onSubmit: SubmitHandler<ServerSource> = async data => {
        console.log(data)

        // const keywordIds = data.val && data.val.map((keyword) => { return keyword.id })

        // const languageIds = data.refName && data.refName.map((language) => { return language.id })

        if (!props.edit) {
            try {
                const newSource = await createSource(data)
                const sourceId = newSource.id
                // keywordIds && await addKeywordsToSource(sourceId, keywordIds)
                // languageIds && await addLanguagesToSource(sourceId, languageIds)
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
                        <Label>Notes</Label>
                        <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                        <Label>Keywords</Label>
                        <KeywordsField control={control} />
                        <Label>Languages</Label>
                        <LanguagesField control={control} />
                        <Label>Part of which corpus?</Label>
                        <Select {...register("partOfCorpus")}>
                            {collectionsState.collections.map((collection, index) => {
                                return <option value={collection.id} key={index}>{collection.title}</option>
                            })}
                        </Select>
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