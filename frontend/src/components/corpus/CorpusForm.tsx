import styled from "@emotion/styled"
import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import React, {useContext} from "react"
import {SubmitHandler, useForm} from "react-hook-form"
import * as yup from "yup"
import {ServerCorpus, ServerKeyword, ServerLanguage, ServerSource,} from "../../model/DexterModel"
import {collectionsContext} from "../../state/collections/collectionContext"
import {sourcesContext} from "../../state/sources/sourcesContext"
import {
    addKeywordsToCorpus,
    addLanguagesToCorpus,
    addSourcesToCorpus,
    createCollection,
    getCollectionById,
    getKeywordsCorpora,
    getLanguagesCorpora,
    getSourcesInCorpus,
    updateCollection,
} from "../../utils/API"
import {KeywordsField} from "../keyword/KeywordsField"
import {LanguagesField} from "../language/LanguagesField"
import {SelectSourceField} from "./SelectSourceField"
import {SubCorpusField} from "./SubCorpusField"
import {errorContext} from "../../state/error/errorContext"
import ScrollableModal from "../common/ScrollableModal"
import {ValidatedSelectField} from "../common/ValidatedSelectField"
import {accessOptions} from "../../model/AccessOptions"

type NewCollectionProps = {
    refetch?: () => void;
    show?: boolean;
    onClose?: () => void;
    edit?: boolean;
    colToEdit?: ServerCorpus | undefined;
    onEdit?: (boolean: boolean) => void;
    refetchCol?: () => void;
};

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
    access: yup.string().required("Access is required"),
})

const formToServer = (data: ServerCorpus) => {
    const newData: any = data
    if (newData.keywords) {
        newData.keywords = newData.keywords.map((kw: ServerKeyword) => {
            return kw.id
        })
    }
    if (newData.languages) {
        newData.languages = newData.languages.map((language: ServerLanguage) => {
            return language.id
        })
    }
    if (newData.sourceIds) {
        newData.sourceIds = newData.sourceIds.map((source: ServerSource) => {
            return source.id
        })
    }
    if (newData.parentId) {
        newData.parentId = newData.parentId
            .map((corpus: ServerCorpus) => {
                return corpus.id
            })
            .toString()
    }

    return newData
}

export function CorpusForm(props: NewCollectionProps) {
    const {sourcesState} = React.useContext(sourcesContext)
    const {collectionsState} = React.useContext(collectionsContext)
    const {dispatchError} = useContext(errorContext)
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: {errors},
        watch
    } = useForm<ServerCorpus>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            keywords: [],
            languages: [],
            sourceIds: [],
            parentId: null,
            access: null,
        },
    })
    const onSubmit: SubmitHandler<ServerCorpus> = async (data) => {

        if (!props.edit) {
            const dataToServer = formToServer(data)
            try {
                const newCollection = await createCollection(dataToServer)
                const corpusId = newCollection.id
                dataToServer.keywords &&
                (await addKeywordsToCorpus(corpusId, dataToServer.keywords))
                dataToServer.languages &&
                (await addLanguagesToCorpus(corpusId, dataToServer.languages))
                dataToServer.sourceIds &&
                (await addSourcesToCorpus(corpusId, dataToServer.sourceIds))
                await props.refetch()
            } catch (error) {
                dispatchError(error)
            }
            props.onClose()
        } else {
            const updatedDataToServer: any = data
            if (updatedDataToServer.keywords) {
                updatedDataToServer.keywords = updatedDataToServer.keywords.map(
                    (kw: ServerKeyword) => {
                        return kw.id
                    }
                )
            }

            if (updatedDataToServer.languages) {
                updatedDataToServer.languages = updatedDataToServer.languages.map(
                    (language: ServerLanguage) => {
                        return language.id
                    }
                )
            }

            if (updatedDataToServer.sourceIds) {
                updatedDataToServer.sourceIds = updatedDataToServer.sourceIds.map(
                    (source: ServerSource) => {
                        return source.id
                    }
                )
            }

            if (updatedDataToServer.parentId) {
                updatedDataToServer.parentId = updatedDataToServer.parentId.id
            }

            const doUpdateCollection = async (
                id: string,
                updatedData: ServerCorpus
            ) => {
                try {
                    await updateCollection(id, updatedData)
                    await addKeywordsToCorpus(id, updatedDataToServer.keywords)
                    await addLanguagesToCorpus(id, updatedDataToServer.languages)
                    await addSourcesToCorpus(id, updatedDataToServer.sourceIds)
                    await props.refetchCol()
                } catch (error) {
                    dispatchError(error)
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

            data.keywords = keywords.map((keyword) => {
                return keyword
            })
            data.languages = languages.map((language) => {
                return language
            })
            data.sourceIds = sources.map((source) => {
                return source
            })

            data.access = data.access.charAt(0).toUpperCase() + data.access.slice(1)

            if (data.parentId) {
                const parentId = data.parentId
                data.parentId = await getCollectionById(parentId)
            }

            const fields = [
                "parentId",
                "title",
                "description",
                "rights",
                "access",
                "location",
                "earliest",
                "latest",
                "contributor",
                "notes",
                "keywords",
                "languages",
                "sourceIds",
            ]
            fields.map((field: any) => {
                setValue(field, data[field])
            })
            register("access")
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
            <ScrollableModal
                show={props.show}
                handleClose={handleClose}
            >
                <h1>{props.edit ? "Edit corpus" : "Create new corpus"}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Label>Title</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        error={!!errors.title}
                        {...register("title")}
                    />
                    <p style={{color: "red"}}>{errors.title?.message}</p>
                    <Label>Description</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        multiline
                        rows={6}
                        error={!!errors.description}
                        {...register("description", {required: true})}
                    />
                    <p style={{color: "red"}}>{errors.description?.message}</p>
                    <Label>Rights</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        error={!!errors.rights}
                        {...register("rights", {required: true})}
                    />
                    <p style={{color: "red"}}>{errors.rights?.message}</p>
                    <ValidatedSelectField
                        label="Access"
                        errorMessage={errors.access?.message}
                        selectedOption={watch("access")}
                        onSelectOption={v => setValue("access", v)}
                        options={accessOptions}
                    />

                    <Label>Location</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        {...register("location")}
                    />
                    <Label>Earliest</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        {...register("earliest")}
                    />
                    <Label>Latest</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("latest")} />
                    <Label>Contributor</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        {...register("contributor")}
                    />
                    <Label>Notes</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                    <Label>Keywords</Label>
                    <KeywordsField
                        control={control}
                        corpusId={props.colToEdit && props.colToEdit.id}
                        setValueCorpus={setValue}
                        edit={collectionsState.editCollection}
                    />
                    <Label>Languages</Label>
                    <LanguagesField
                        control={control}
                        corpusId={props.colToEdit && props.colToEdit.id}
                        setValueCorpus={setValue}
                        edit={collectionsState.editCollection}
                    />
                    <Label>Add sources to corpus</Label>
                    <SelectSourceField
                        control={control}
                        sources={sourcesState.sources}
                        corpusId={props.colToEdit && props.colToEdit.id}
                        setValue={setValue}
                        edit={collectionsState.editCollection}
                    />
                    <Label>Add corpus to which main corpus?</Label>
                    <SubCorpusField
                        control={control}
                        corpora={collectionsState.collections}
                    />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </form>
                <Button variant="contained" onClick={handleClose}>
                    Close
                </Button>
            </ScrollableModal>
        </>
    )
}
