import {yupResolver} from "@hookform/resolvers/yup"
import React, {ChangeEvent, useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {
    AccessOptions,
    FormMetadataValue,
    ImportResult,
    ResultMetadataKey,
    ResultMetadataValue,
    Source,
    SourceFormSubmit,
    toFormMetadataValue,
    UUID
} from "../../model/DexterModel"
import {
    addKeywordsToSource,
    addLanguagesToSource,
    addMetadataValueToSource,
    addSourcesToCorpus,
    createMetadataValue,
    createSource,
    deleteKeywordFromSource,
    deleteLanguageFromSource,
    deleteMetadataValueFromSource,
    getMetadataKeys,
    postImport,
    updateMetadataValue,
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
import _ from "lodash"
import MenuItem from "@mui/material/MenuItem"
import {Button, FormControl, Select} from "@mui/material"
import {InputButtonGrid} from "../common/InputButtonGrid"
import TextField from "@mui/material/TextField"
import {DeleteIconStyled} from "../common/DeleteIconStyled"

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

    const [keys, setKeys] = useState<ResultMetadataKey[]>([])
    const [values, setValues] = useState<FormMetadataValue[]>([])

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
            data.metadataValues = await submitMetadataValues()
            await updateChildResources(id, data)
            props.onSave({id, ...data})
        } catch (error) {
            await filterFormFieldErrors(error, setFieldError)
        }
    }

    async function submitMetadataValues() {
        const toCreate = !props.sourceToEdit
            ? values.filter(v => !findSourceValue(v))
            : values
        const toUpdate = props.sourceToEdit
            ? values.filter(v => findSourceValue(v))
            : []
        const updated = await updateMetadataValues(toUpdate)
        const created = await createMetadataValues(toCreate)
        return [...updated, ...created]
    }

    async function updateMetadataValues(
        toUpdate: FormMetadataValue[]
    ): Promise<ResultMetadataValue[]> {
        return await Promise.all(
            toUpdate.map(v =>
                updateMetadataValue(findSourceValue(v).id, v)
            )
        )
    }

    async function createMetadataValues(
        toCreate: FormMetadataValue[]
    ): Promise<ResultMetadataValue[]> {
        return await Promise.all(
            toCreate.map(createMetadataValue)
        )
    }

    function findSourceValue(v: FormMetadataValue) {
        return props.sourceToEdit.metadataValues.find(sv => sv.keyId === v.keyId)
    }

    async function updateChildResources(id: UUID, data: SourceFormSubmit) {
        await updateRemoteIds(id, data.keywords, addKeywordsToSource, deleteKeywordFromSource)
        await updateRemoteIds(id, data.languages, addLanguagesToSource, deleteLanguageFromSource)
        await updateRemoteIds(id, data.metadataValues, addMetadataValueToSource, deleteMetadataValueFromSource)
    }


    async function updateExistingSource(
        data: SourceFormSubmit
    ): Promise<UUID> {
        const sourceId = props.sourceToEdit.id
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
        if (fieldError) {
            console.error('field error:', fieldError)
            scrollToError()
        }
    }, [fieldError])


    useEffect(() => {
        init()

        async function init() {
            setKeys(await getMetadataKeys())

            if (props.sourceToEdit) {
                formFields.map((field: keyof Source) => {
                    setValue(field, props.sourceToEdit[field])
                })
                setValues(props.sourceToEdit.metadataValues.map(toFormMetadataValue))
            }
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

    function renderFormField(
        fieldName: keyof Source
    ) {
        return <TextFieldWithError
            label={_.capitalize(fieldName)}
            {...register(fieldName, {required: true})}
            message={getErrorMessage(fieldName)}
        />
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

            {renderFormField("title")}

            <TextFieldWithError
                label="Description"
                {...register("description", {required: true})}
                message={getErrorMessage("description")}
                multiline
                rows={6}
            />

            {renderFormField("creator")}
            {renderFormField("rights")}

            <ValidatedSelectField
                label="Access"
                message={getErrorMessage("access")}
                selectedOption={watch("access")}
                onSelectOption={(e) => setValue("access", e)}
                options={AccessOptions}
            />

            {renderFormField("location")}
            {renderFormField("earliest")}
            {renderFormField("latest")}
            {renderFormField("notes")}

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

            <SourceMetadataValueFields
                keys={keys}
                values={values}
                onChange={setValues}
            />

            <SubmitButton/>
        </form>
    </ScrollableModal>
}

const IMPORTABLE_URL = new RegExp("https://hdl\\.handle\\.net/[0-9.]*/([0-9]*)")

function isImportableUrl(externalRef?: string): boolean {
    return IMPORTABLE_URL.test(externalRef)
}


type SourceMetadataValueFieldsProps = {
    keys: ResultMetadataKey[],
    values: FormMetadataValue[]
    onChange: (values: FormMetadataValue[]) => void
}

const NONE_SELECTED = "none-selected"

export function SourceMetadataValueFields(props: SourceMetadataValueFieldsProps) {

    const [selectedKeyId, setSelectedKeyId] = useState(NONE_SELECTED)
    const [formValues, setFormValues] = useState(props.values)
    const debouncedFormValues = useDebounce(formValues)

    async function handleCreateField() {
        console.log("Create metadata value field", selectedKeyId)
        const created = await createMetadataValue({
            keyId: selectedKeyId,
            value: ""
        })
        const update = [...formValues, created]
        setSelectedKeyId(NONE_SELECTED)
        setFormValues(update)
    }

    async function handleDelete(toDelete: FormMetadataValue) {
        const update = formValues.filter(v => v.keyId !== toDelete.keyId)
        setSelectedKeyId(NONE_SELECTED)
        setFormValues(update)
    }

    useEffect(() => {
        handleDebouncedFormValueChange()

        async function handleDebouncedFormValueChange() {
            if (!debouncedFormValues) {
                return
            }
            props.onChange(debouncedFormValues)
        }
    }, [debouncedFormValues])

    function handleChangeFormValue(
        changed: FormMetadataValue,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const update = formValues?.map(fv => fv.keyId === changed.keyId ? {
            keyId: changed.keyId,
            value: event.target.value
        } : fv)
        setFormValues(update)
    }

    return <>
        <FormControl fullWidth>
            <Label>Metadata</Label>
            <InputButtonGrid
                input={
                    <Select
                        labelId="metadata-field-select-label"
                        fullWidth
                        value={selectedKeyId}
                        onChange={e => setSelectedKeyId(e.target.value)}
                    >
                        <MenuItem value={NONE_SELECTED}>Select a metadata field</MenuItem>
                        {props.keys.map((k, i) =>
                            <MenuItem key={i} value={k.id}>
                                {k.key}
                            </MenuItem>
                        )}
                    </Select>
                }
                button={
                    <Button
                        disabled={selectedKeyId === NONE_SELECTED}
                        fullWidth
                        variant="contained"
                        onClick={handleCreateField}
                    >
                        Add
                    </Button>
                }
            />
            {formValues.map((value, i) => <div key={i}>
                <Label>{props.keys.find(k => k.id === value.keyId).key}</Label>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={value.value}
                    onChange={e => handleChangeFormValue(value, e)}
                    autoFocus
                    InputProps={{
                        endAdornment: <DeleteIconStyled
                            onClick={() => handleDelete(value)}
                        />,
                    }}
                />
            </div>)}
        </FormControl>
    </>
}
