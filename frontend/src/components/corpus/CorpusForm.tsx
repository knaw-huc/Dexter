import styled from "@emotion/styled"
import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import React, {useContext, useState} from "react"
import {SubmitHandler, useForm} from "react-hook-form"
import * as yup from "yup"
import {
    AccessOptions,
    ServerCorpus,
    ServerFormCorpus,
    ServerKeyword,
    ServerLanguage,
    ServerResultCorpus,
    ServerResultSource,
    ServerSource,
} from "../../model/DexterModel"
import {
    addKeywordsToCorpus,
    addLanguagesToCorpus,
    addSourceResources,
    addSourcesToCorpus,
    createCollection,
    deleteKeywordFromCorpus,
    deleteLanguageFromCorpus,
    deleteSourceFromCorpus,
    updateCorpus,
} from "../../utils/API"
import {KeywordField} from "../keyword/KeywordField"
import {LanguagesField} from "../language/LanguagesField"
import {SubCorpusField} from "./SubCorpusField"
import {errorContext} from "../../state/error/errorContext"
import ScrollableModal from "../common/ScrollableModal"
import {ValidatedSelectField} from "../common/ValidatedSelectField"
import {LinkSourceField} from "./LinkSourceField"

type CorpusFormProps = {
    corpusToEdit?: ServerCorpus | undefined,
    parentOptions: ServerResultCorpus[],
    sourceOptions: ServerResultSource[],
    onSave: (edited: ServerCorpus) => void,
    onClose: () => void,
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

export function CorpusForm(props: CorpusFormProps) {
    const {dispatchError} = useContext(errorContext)
    const {
        register,
        handleSubmit,
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
            sources: [],
            parent: null,
            access: null,
        },
    })
    const [isInit, setInit] = useState(false)
    const [isLoaded, setLoaded] = useState(false)

    const onSubmit: SubmitHandler<ServerCorpus> = async (data: ServerCorpus) => {

        if (!props.corpusToEdit) {
            const serverCreateForm = formToServer(data)
            try {
                const newCollection = await createCollection(serverCreateForm)
                const corpusId = newCollection.id
                serverCreateForm.keywords &&
                (await addKeywordsToCorpus(corpusId, serverCreateForm.keywords))
                serverCreateForm.languages &&
                (await addLanguagesToCorpus(corpusId, serverCreateForm.languages))
                serverCreateForm.sourceIds &&
                (await addSourcesToCorpus(corpusId, serverCreateForm.sourceIds))

            } catch (error) {
                dispatchError(error)
            }
        } else {
            const submitCorpusToBackend = async () => {
                const id = props.corpusToEdit.id;
                try {
                    const serverUpdateForm: ServerFormCorpus = {
                        ...data,
                    }

                    await updateCorpus(id, serverUpdateForm)

                    const keywordsUpdate = data.keywords.map(kw => kw.id)
                    const responseKeywords = await addKeywordsToCorpus(id, keywordsUpdate)
                    const keysToDelete = responseKeywords
                        .map(s => s.id)
                        .filter(ls => !keywordsUpdate.includes(ls))
                    for (const keyToDelete of keysToDelete) {
                        await deleteKeywordFromCorpus(id, keyToDelete)
                    }

                    const languagesUpdate = data.languages.map(l => l.id)
                    const responseLanguages = await addLanguagesToCorpus(id, languagesUpdate)
                    const languagesToDelete = responseLanguages
                        .map(l => l.id)
                        .filter(ls => !languagesUpdate.includes(ls))
                    for (const languageToDelete of languagesToDelete) {
                        await deleteLanguageFromCorpus(id, languageToDelete)
                    }

                    if (serverUpdateForm.parentId) {
                        serverUpdateForm.parentId = data.parent.id
                    }

                    const sourceIdsUpdate = data.sources.map(s => s.id)
                    const responseSources = await addSourcesToCorpus(id, sourceIdsUpdate)
                    const sourcesToDelete = responseSources
                        .map(s => s.id)
                        .filter(ls => !sourceIdsUpdate.includes(ls))
                    for (const sourceToDelete of sourcesToDelete) {
                        await deleteSourceFromCorpus(id, sourceToDelete)
                    }
                } catch (error) {
                    dispatchError(error)
                }
            }
            submitCorpusToBackend()
        }

        props.onSave(data)
    }

    React.useEffect(() => {
        const initFormFields = async () => {
            setInit(true)
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
                "sources",
            ]
            fields.map((field: keyof ServerCorpus) => {
                setValue(field, props.corpusToEdit[field])
            })
            register("access")
            setLoaded(true)
        }
        if(isInit) {
            return;
        }
        if (props.corpusToEdit) {
            initFormFields()
        } else {
            setInit(true)
            setLoaded(true)
        }
    }, [isInit, isLoaded])

    const allSources = props.sourceOptions
    const selectedSources = watch("sources")

    function unlinkSource(sourceId: string) {
        return setValue("sources", selectedSources.filter(s => s.id !== sourceId))
    }

    async function linkSource(sourceId: string) {
        const newSource = await addSourceResources(
            allSources.find(s => s.id === sourceId)
        )
        return setValue("sources", [...selectedSources, newSource])
    }

    if(!isLoaded) {
        return null;
    }
    return (
        <>
            <ScrollableModal
                show={true}
                handleClose={props.onClose}
            >
                <h1>{props.corpusToEdit ? "Edit corpus" : "Create new corpus"}</h1>
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
                        options={AccessOptions}
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
                    <KeywordField
                        selected={watch("keywords")}
                        onChangeSelected={selected => {
                            if (!window.confirm(
                                "Are you sure you wish to delete this keyword?"
                            )) {
                                return
                            }
                            setValue("keywords", selected)
                        }}
                    />
                    <Label>Languages</Label>
                    <LanguagesField
                        control={control}
                        corpusId={props.corpusToEdit && props.corpusToEdit.id}
                        setValueCorpus={setValue}
                        edit={!!props.corpusToEdit}
                    />
                    <Label>Add sources to corpus</Label>
                    <LinkSourceField
                        options={allSources}
                        selected={selectedSources}
                        onLinkSource={linkSource}
                        onUnlinkSource={unlinkSource}
                    />
                    <Label>Add corpus to which main corpus?</Label>
                    <SubCorpusField
                        control={control}
                        corpora={props.parentOptions}
                    />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </form>
                <Button variant="contained" onClick={props.onClose}>
                    Close
                </Button>
            </ScrollableModal>
        </>
    )
}
