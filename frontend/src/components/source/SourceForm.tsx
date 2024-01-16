import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {AccessOptions, Source, SourceFormSubmit, UUID} from "../../model/DexterModel"
import {
    addKeywordsToSource,
    addLanguagesToSource,
    addSourcesToCorpus,
    createSource,
    deleteKeywordFromSource,
    deleteLanguageFromSource,
    getSourceWithResourcesById,
    postImport,
    updateSource,
} from "../../utils/API"
import ScrollableModal from "../common/ScrollableModal"
import {KeywordField} from "../keyword/KeywordField"
import {LanguagesField} from "../language/LanguagesField"
import {Alert} from "@mui/material"
import isUrl from "../../utils/isUrl"
import {useDebounce} from "../../utils/useDebounce"
import {Label} from "../common/Label"
import {ValidatedSelectField} from "../common/ValidatedSelectField"
import {ERROR_MESSAGE_CLASS, ErrorMsg} from "../common/ErrorMsg"
import {TextFieldWithError} from "./TextFieldWithError"
import {ErrorByField, FormError, setBackendErrors} from "../common/FormError"
import {CloseInlineIcon} from "../common/CloseInlineIcon"

const formFields = [
    "externalRef",
    "title",
    "description",
    "creator",
    "rights",
    "access",
    "location",
    "earliest",
    "latest",
    "notes",
    "keywords",
    "languages",
]


type SourceFormProps = {
    sourceToEdit?: Source;
    corpusId?: string;
    onSave: (data: Source) => void
    onClose: () => void;
};

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    creator: yup.string().required("Creator is required"),
    rights: yup.string().required("Rights is required"),
    access: yup.string().oneOf(AccessOptions).required("Access is required"),
})

export function SourceForm(props: SourceFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: {errors},
        watch
    } = useForm<Source>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {keywords: [], languages: [], access: null},
    })

    const [externalRefError, setExternalRefError] = useState<Error>(null)
    const [isExternalRefLoading, setExternalRefLoading] = useState(false)
    const externalRef = watch("externalRef")
    const debouncedExternalRef = useDebounce<string>(externalRef, 500)
    const [backendError, setBackendError] = useState<ErrorByField>()

    async function importMetadata() {
        if (isExternalRefLoading) {
            return
        }
        if (!isUrl(debouncedExternalRef)) {
            setExternalRefError(new Error("Not an url"))
            return
        }
        setExternalRefLoading(true)
        const tmsImport = await postImport(new URL(debouncedExternalRef))
            .catch(setExternalRefError)
        if (!tmsImport || !tmsImport.isValidExternalReference) {
            setExternalRefError(new Error("Is not a valid external reference"))
        } else {
            Object.keys(tmsImport.imported).forEach(key => {
                if (tmsImport.imported[key]) {
                    setValue(key as keyof Source, tmsImport.imported[key])
                }
            })
        }
        setExternalRefLoading(false)
    }

    async function onSubmit(data: SourceFormSubmit) {
        const id: UUID = props.sourceToEdit
            ? await updateExistingSource(props.sourceToEdit.id, data)
            : await createNewSource(data)
        try {
            props.onSave({id, ...data})
        } catch (error) {
            await setBackendErrors(error, setBackendError)
        }
    }

    async function updateExistingSource(
        id: string,
        data: SourceFormSubmit
    ): Promise<UUID> {
        await updateSource(id, data)

        const keywordIds = data.keywords.map(k => k.id)
        const responseKeywords = await addKeywordsToSource(id, keywordIds)
        const keysToDelete = responseKeywords
            .map(s => s.id)
            .filter(ls => !keywordIds.includes(ls))
        for (const keyToDelete of keysToDelete) {
            await deleteKeywordFromSource(id, keyToDelete)
        }

        const languageIds = data.languages.map(l => l.id)
        const responseLanguages = await addLanguagesToSource(id, languageIds)
        const languagesToDelete = responseLanguages
            .map(l => l.id)
            .filter(ls => !languageIds.includes(ls))
        for (const languageToDelete of languagesToDelete) {
            await deleteLanguageFromSource(id, languageToDelete)
        }
        return id;
    }

    async function createNewSource(
        data: SourceFormSubmit,
    ): Promise<UUID> {
        const newSource = await createSource(data)
        const sourceId = newSource.id
        if (data.keywords?.length) {
            await addKeywordsToSource(sourceId, data.keywords.map(k => k.id))
        }
        if (data.languages?.length) {
            await addLanguagesToSource(sourceId, data.languages.map(l => l.id))
        }
        if (props.corpusId?.length) {
            await addSourcesToCorpus(props.corpusId, [sourceId])
        }
        return sourceId;
    }

    useEffect(() => {
        const hasErrors = Object.keys(errors).length || backendError?.field
        if (!hasErrors) {
            return
        }
        document
            .querySelector(`.${ERROR_MESSAGE_CLASS}`)
            ?.scrollIntoView({behavior: "smooth"})
    }, [errors, backendError])


    React.useEffect(() => {
        const doGetSourceById = async (id: string) => {
            const data: Source = await getSourceWithResourcesById(id)
            formFields.map((field: keyof Source) => {
                setValue(field, data[field])
            })
        }

        if (props.sourceToEdit) {
            doGetSourceById(props.sourceToEdit.id)
        } else {
            return
        }
    }, [props.sourceToEdit, setValue])

    function getErrorMessage(field: keyof Source): string | undefined {
        if (errors[field]?.message) {
            return errors[field].message
        }
        if (backendError?.field === field) {
            return backendError.error.message
        }
    }

    return <ScrollableModal
        show={true}
        handleClose={props.onClose}
    >
        <CloseInlineIcon
            style={{float: "right", top: 0}}
            onClick={props.onClose}
        />
        <h1>{props.sourceToEdit ? "Edit source" : "Create new source"}</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormError error={backendError}/>

            <TextFieldWithError
                label="External Reference"
                {...register("externalRef")}
                errorMessage={getErrorMessage("externalRef")}
            />

            <Alert
                severity="info"
                aria-disabled={isExternalRefLoading}
            >
                <Button
                    variant="contained"
                    disableElevation
                    onClick={() => importMetadata()}
                    disabled={isExternalRefLoading}
                >
                    import
                </Button>
                <p>Import and fill out found form fields with metadata from external reference</p>
                <p>Note: will overwrite existing values</p>
            </Alert>
            {externalRefError && <Alert severity="error">
                Could not import: {externalRefError.message}
            </Alert>}

            <TextFieldWithError
                label="Title"
                {...register("title", {required: true})}
                errorMessage={getErrorMessage("title")}
                multiline
                rows={6}
            />

            <TextFieldWithError
                label="Description"
                {...register("description", {required: true})}
                errorMessage={getErrorMessage("description")}
                multiline
                rows={6}
            />

            <TextFieldWithError
                label="Creator"
                {...register("creator")}
                errorMessage={getErrorMessage("creator")}
            />

            <TextFieldWithError
                label="Rights"
                {...register("rights")}
                errorMessage={getErrorMessage("rights")}
            />

            <ValidatedSelectField
                label="Access"
                errorMessage={getErrorMessage("access")}
                selectedOption={watch("access")}
                onSelectOption={(e) => setValue("access", e)}
                options={AccessOptions}
            />

            <TextFieldWithError
                label="Location"
                {...register("location")}
                errorMessage={getErrorMessage("location")}
            />

            <TextFieldWithError
                label="Earliest"
                {...register("earliest")}
                errorMessage={getErrorMessage("earliest")}
            />

            <TextFieldWithError
                label="Latest"
                {...register("latest")}
                errorMessage={getErrorMessage("latest")}
            />

            <TextFieldWithError
                label="Notes"
                {...register("notes")}
                errorMessage={getErrorMessage("notes")}
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
                sourceId={props.sourceToEdit && props.sourceToEdit.id}
                setValueSource={setValue}
                edit={!!props.sourceToEdit}
            />
            <ErrorMsg msg={getErrorMessage("languages")}/>

            <Button variant="contained" type="submit">
                Submit
            </Button>
        </form>
    </ScrollableModal>
}



