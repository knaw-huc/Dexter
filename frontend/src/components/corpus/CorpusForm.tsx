import styled from "@emotion/styled"
import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import React, {useContext, useState} from "react"
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {
    AccessOptions,
    ServerCorpus,
    ServerFormCorpus,
    ServerKeyword,
    ServerLanguage,
    ServerResultCorpus,
    ServerResultSource,
    Source,
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
import ScrollableModal from "../common/ScrollableModal"
import {ValidatedSelectField} from "../common/ValidatedSelectField"
import {LinkSourceField} from "./LinkSourceField"
import {ErrorByField, FormError, setBackendErrors} from "../common/FormError"
import {TextFieldWithError} from "../source/TextFieldWithError"
import {ErrorMsg} from "../common/ErrorMsg"
import _ from "lodash"

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
        newData.sourceIds = newData.sourceIds.map((source: Source) => {
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
    const [backendError, setBackendError] = useState<ErrorByField>()
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

    async function createNewCorpus(data: ServerResultCorpus & {
        parent?: { id: string; title: string };
        keywords: ServerKeyword[];
        languages: ServerLanguage[];
        sources: Source[]
    }) {
        const serverCreateForm = formToServer(data)
        const newCorpus = await createCollection(serverCreateForm)
        const newId = newCorpus.id
        serverCreateForm.keywords &&
        (await addKeywordsToCorpus(newId, serverCreateForm.keywords))
        serverCreateForm.languages &&
        (await addLanguagesToCorpus(newId, serverCreateForm.languages))
        serverCreateForm.sourceIds &&
        (await addSourcesToCorpus(newId, serverCreateForm.sourceIds))
        return newId
    }

    async function updateExistingCorpus(
        data: ServerCorpus,
        id: string
    ) {
        const updateId = props.corpusToEdit.id
        const serverUpdateForm: ServerFormCorpus = {
            ...data,
        }
        await updateCorpus(updateId, serverUpdateForm)
        const keywordsUpdate = data.keywords.map(kw => kw.id)
        const responseKeywords = await addKeywordsToCorpus(updateId, keywordsUpdate)
        const keysToDelete = responseKeywords
            .map(s => s.id)
            .filter(ls => !keywordsUpdate.includes(ls))
        for (const keyToDelete of keysToDelete) {
            await deleteKeywordFromCorpus(updateId, keyToDelete)
        }
        const languagesUpdate = data.languages.map(l => l.id)

        const responseLanguages = await addLanguagesToCorpus(updateId, languagesUpdate)
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
            await deleteSourceFromCorpus(updateId, sourceToDelete)
        }
        return id;
    }

    async function onSubmit(data: ServerCorpus) {
        try {
            const id = !props.corpusToEdit
                ? await createNewCorpus(data)
                : await updateExistingCorpus(data, props.corpusToEdit.id);
            props.onSave({id, ...data})
        } catch (e) {
            await setBackendErrors(e, setBackendError)
        }

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
        if (isInit) {
            return
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
        const toAdd = allSources.find(s => s.id === sourceId)
        const withResources = await addSourceResources(toAdd)
        return setValue("sources", [...selectedSources, withResources])
    }

    function getErrorMessage(field: keyof ServerCorpus): string | undefined {
        if (errors[field]?.message) {
            return errors[field].message
        }
        if (backendError?.field === field) {
            return backendError.error.message
        }
    }

    function renderFormField(
        fieldName: keyof ServerCorpus
    ) {
        return <TextFieldWithError
            label={_.capitalize(fieldName)}
            {...register(fieldName, {required: true})}
            errorMessage={getErrorMessage(fieldName)}
        />
    }

    if (!isLoaded) {
        return null
    }
    return (
        <>
            <ScrollableModal
                show={true}
                handleClose={props.onClose}
            >
                <h1>{props.corpusToEdit ? "Edit corpus" : "Create new corpus"}</h1>
                <FormError error={backendError}/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {renderFormField("title")}
                    {renderFormField("description")}
                    {renderFormField("rights")}
                    <ValidatedSelectField
                        label="Access"
                        errorMessage={errors.access?.message}
                        selectedOption={watch("access")}
                        onSelectOption={v => setValue("access", v)}
                        options={AccessOptions}
                    />
                    {renderFormField("location")}
                    {renderFormField("earliest")}
                    {renderFormField("latest")}
                    {renderFormField("contributor")}
                    <TextFieldWithError
                        label="notes"
                        {...register("notes", {required: true})}
                        errorMessage={getErrorMessage("notes")}
                        multiline
                        rows={6}
                    />
                    <Label>Keywords</Label>
                    <KeywordField
                        selected={watch("keywords")}
                        onChangeSelected={selected => {
                            setValue("keywords", selected)
                        }}
                    />
                    <ErrorMsg msg={getErrorMessage("keywords")}/>
                    <Label>Languages</Label>
                    <LanguagesField
                        control={control}
                        corpusId={props.corpusToEdit && props.corpusToEdit.id}
                        setValueCorpus={setValue}
                        edit={!!props.corpusToEdit}
                    />
                    <ErrorMsg msg={getErrorMessage("languages")}/>
                    <Label>Add sources to corpus</Label>
                    <LinkSourceField
                        options={allSources}
                        selected={selectedSources}
                        onLinkSource={linkSource}
                        onUnlinkSource={unlinkSource}
                    />
                    <ErrorMsg msg={getErrorMessage("sources")}/>
                    <Label>Add corpus to which main corpus?</Label>
                    <SubCorpusField
                        control={control}
                        corpora={props.parentOptions}
                    />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </form>
                <ErrorMsg msg={getErrorMessage("parentId")}/>
                <Button variant="contained" onClick={props.onClose}>
                    Close
                </Button>
            </ScrollableModal>
        </>
    )
}
