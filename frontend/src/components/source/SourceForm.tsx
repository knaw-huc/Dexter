import {yupResolver} from "@hookform/resolvers/yup"
import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {AccessOptions, ImportResult, Source, SourceFormSubmit, UUID} from "../../model/DexterModel"
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
import {AddKeywordField} from "../keyword/AddKeywordField"
import {LanguagesField} from "../language/LanguagesField"
import isUrl from "../../utils/isUrl"
import {useDebounce} from "../../utils/useDebounce"
import {Label} from "../common/Label"
import {ValidatedSelectField} from "../common/ValidatedSelectField"
import {ErrorMsg} from "../common/ErrorMsg"
import {TextFieldWithError} from "./TextFieldWithError"
import {ErrorByField, filterFormFieldErrors, FormError, scrollToError} from "../common/FormError"
import {CloseInlineIcon} from "../common/CloseInlineIcon"
import {SubmitButton} from "../common/SubmitButton"
import {ImportField} from "./ImportField"
import {updateRemoteIds} from "../../utils/updateRemoteIds"

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
        formState: {errors},
        watch
    } = useForm<Source>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {keywords: [], languages: [], access: null},
    })

    const [isExternalRefLoading, setExternalRefLoading] = useState(false)
    const externalRef = watch("externalRef")
    const debouncedExternalRef = useDebounce<string>(externalRef, 500)
    const [fieldError, setFieldError] = useState<ErrorByField>()

    async function handleImportMetadata() {
        const warning = window.confirm(
            "Importing overwrites existing values. Are you sure you want to import?"
        )

        if (warning === false) return

        if (isExternalRefLoading) {
            return
        }
        if (!isUrl(debouncedExternalRef)) {
            return
        }

        setExternalRefLoading(true)
        let tmsImport: ImportResult
        try {
            tmsImport = await postImport(new URL(debouncedExternalRef))
        } catch (e) {
            await filterFormFieldErrors(e, setFieldError)
        }
        if (!tmsImport || !tmsImport.isValidExternalReference) {
            setFieldError({
                field: "externalRef",
                error: {message: "Is not a valid external reference"}
            })
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
        try {
            const id: UUID = props.sourceToEdit
                ? await updateExistingSource(data)
                : await createNewSource(data)
            await updateChildResources(id, data)
            props.onSave({id, ...data})
        } catch (error) {
            await filterFormFieldErrors(error, setFieldError)
        }
    }

    async function updateChildResources(id: string, data: SourceFormSubmit) {
        await updateRemoteIds(id, data.keywords, addKeywordsToSource, deleteKeywordFromSource)
        await updateRemoteIds(id, data.languages, addLanguagesToSource, deleteLanguageFromSource)
    }

    async function updateExistingSource(
        data: SourceFormSubmit
    ): Promise<UUID> {
        const sourceId = props.sourceToEdit.id;
        await updateSource(sourceId, data)
        return sourceId
    }

    async function createNewSource(
        data: SourceFormSubmit,
    ): Promise<UUID> {
        const newSource = await createSource(data)
        const sourceId = newSource.id
        if (props.corpusId?.length) {
            await addSourcesToCorpus(props.corpusId, [sourceId])
        }
        return sourceId
    }

    useEffect(() => {
        if(fieldError) {
            scrollToError()
        }
    }, [fieldError])


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
        if (fieldError?.field === field) {
            return fieldError.error.message
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
            <FormError error={fieldError}/>

            <ImportField
                label="External Reference"
                {...register("externalRef")}
                message={getErrorMessage("externalRef")}
                onImport={handleImportMetadata}
                isImporting={isExternalRefLoading}
                isRefImportable={isImportableUrl(watch("externalRef"))}
            />

            <TextFieldWithError
                label="Title"
                {...register("title", {required: true})}
                message={getErrorMessage("title")}
            />

            <TextFieldWithError
                label="Description"
                {...register("description", {required: true})}
                message={getErrorMessage("description")}
                multiline
                rows={6}
            />

            <TextFieldWithError
                label="Creator"
                {...register("creator")}
                message={getErrorMessage("creator")}
            />

            <TextFieldWithError
                label="Rights"
                {...register("rights")}
                message={getErrorMessage("rights")}
            />

            <ValidatedSelectField
                label="Access"
                message={getErrorMessage("access")}
                selectedOption={watch("access")}
                onSelectOption={(e) => setValue("access", e)}
                options={AccessOptions}
            />

            <TextFieldWithError
                label="Location"
                {...register("location")}
                message={getErrorMessage("location")}
            />

            <TextFieldWithError
                label="Earliest"
                {...register("earliest")}
                message={getErrorMessage("earliest")}
            />

            <TextFieldWithError
                label="Latest"
                {...register("latest")}
                message={getErrorMessage("latest")}
            />

            <TextFieldWithError
                label="Notes"
                {...register("notes")}
                message={getErrorMessage("notes")}
            />

            <Label>Keywords</Label>
            <AddKeywordField
                selected={watch("keywords")}
                onChangeSelected={selected => {
                    setValue("keywords", selected)
                }}
            />
            <ErrorMsg msg={getErrorMessage("keywords")}/>

            <Label>Languages</Label>
            <LanguagesField
                selected={watch("languages")}
                onChangeSelected={selected => {
                    setValue("languages", selected)
                }}
            />
            <ErrorMsg msg={getErrorMessage("languages")}/>

            <SubmitButton/>
        </form>
    </ScrollableModal>
}

const IMPORTABLE_URL = new RegExp("https://hdl\\.handle\\.net/20\\.500\\.11840/([0-9]*)")

function isImportableUrl(externalRef?: string): boolean {
    return IMPORTABLE_URL.test(externalRef)
}

