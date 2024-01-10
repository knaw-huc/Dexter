import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import React, {useEffect, useState} from "react"
import {SubmitHandler, useForm} from "react-hook-form"
import * as yup from "yup"
import {ServerCorpus, ServerKeyword, ServerLanguage, ServerSource} from "../../model/DexterModel"
import {sourcesContext} from "../../state/sources/sourcesContext"
import {
    addKeywordsToSource,
    addLanguagesToSource,
    addSourcesToCorpus,
    createSource,
    getKeywordsSources,
    getLanguagesSources,
    getSourceById,
    postImport,
    ResponseError,
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
import {TextFieldStyled} from "./TextFieldStyled"
import {accessOptions} from "../../model/AccessOptions"

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

type BackendError = Pick<Error, "message">
type FormField = string | "generic"
type BackendErrorByField = { field: FormField, error: BackendError }

type SourceFormProps = {
    refetch?: () => void;
    show?: boolean;
    onClose?: () => void;
    edit?: boolean;
    sourceToEdit?: ServerSource | undefined;
    onEdit?: (boolean: boolean) => void;
    refetchSource?: () => void;
    corpusId?: string;
};

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    creator: yup.string().required("Creator is required"),
    rights: yup.string().required("Rights is required"),
    access: yup.string().oneOf(accessOptions).required("Access is required"),
})

const formToServer = (data: ServerSource) => {
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
    if (newData.partOfCorpus) {
        newData.partOfCorpus = newData.partOfCorpus.map((corpus: ServerCorpus) => {
            return corpus.id
        })
    }
    return newData
}

export function SourceForm(props: SourceFormProps) {
    const {sourcesState} = React.useContext(sourcesContext)
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: {errors},
        watch
    } = useForm<ServerSource>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {keywords: [], languages: [], access: null},
    })

    const [externalRefError, setExternalRefError] = useState<Error>(null)
    const [isExternalRefLoading, setExternalRefLoading] = useState(false)
    const externalRef = watch("externalRef")
    const debouncedExternalRef = useDebounce<string>(externalRef, 500)
    const [backendError, setBackendError] = useState<BackendErrorByField>()

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
                    setValue(key as keyof ServerSource, tmsImport.imported[key])
                }
            })
        }
        setExternalRefLoading(false)
    }

    const onSubmit: SubmitHandler<ServerSource> = async (data) => {
        setBackendError(null)

        if (!props.edit) {
            const dataToServer = formToServer(data)
            try {
                const newSource = await createSource(dataToServer)
                const sourceId = newSource.id
                dataToServer.keywords &&
                (await addKeywordsToSource(sourceId, dataToServer.keywords))
                dataToServer.languages &&
                (await addLanguagesToSource(sourceId, dataToServer.languages))
                props.corpusId &&
                (await addSourcesToCorpus(props.corpusId, [sourceId]))
                await props.refetch()
                props.onClose()
            } catch (error) {
                await setBackendErrors(error)
            }
        } else {
            const doUpdateSource = async (id: string, updatedData: ServerSource) => {
                try {
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
                    await updateSource(id, updatedData)
                    await addKeywordsToSource(id, updatedDataToServer.keywords)
                    await addLanguagesToSource(id, updatedDataToServer.languages)
                    await props.refetchSource()
                } catch (error) {
                    await setBackendErrors(error)
                }
            }
            doUpdateSource(props.sourceToEdit.id, data)
            props.onClose()
        }

        async function setBackendErrors(error: ResponseError) {
            const errorResponseBody = await error.response.json()
            if (errorResponseBody.message.includes("SOURCES_UNIQUE_TITLE_CONSTRAINT")) {
                setBackendError({field: "title", error: {message: "Title already exists"}})
            } else {
                setBackendError({field: "generic", error: {message: errorResponseBody.message}})
            }
        }
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
            const data: ServerSource = await getSourceById(id)
            const keywords = await getKeywordsSources(id)
            const languages = await getLanguagesSources(id)

            data.keywords = keywords.map((keyword) => {
                return keyword
            })
            data.languages = languages.map((language) => {
                return language
            })

            formFields.map((field: keyof ServerSource) => {
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

    function getErrorMessage(field: keyof ServerSource): string | undefined {
        if (errors[field]?.message) {
            return errors[field].message
        }
        if (backendError?.field === field) {
            return backendError.error.message
        }
    }

    return <ScrollableModal
        show={props.show}
        handleClose={handleClose}
    >
        <h1>{props.edit ? "Edit source" : "Create new source"}</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            {backendError?.field === "generic" && <Alert className={ERROR_MESSAGE_CLASS} severity="error">
                Could not save: {backendError.error.message}
            </Alert>}

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

            <>
                <Label
                    style={{textTransform: "capitalize"}}
                >
                    Title
                </Label>
                <TextFieldStyled
                    fullWidth={true}
                    margin="dense"
                    {...register("title")}
                    error={!!getErrorMessage("title")}
                />
                {getErrorMessage("title") && <ErrorMsg msg={getErrorMessage("title")}/>}
            </>

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
                options={accessOptions}
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
                onChangeSelected={selected => setValue("keywords", selected)}
            />
            <ErrorMsg msg={getErrorMessage("keywords")}/>

            <Label>Languages</Label>
            <LanguagesField
                control={control}
                sourceId={props.sourceToEdit && props.sourceToEdit.id}
                setValueSource={setValue}
                edit={sourcesState.editSourceMode}
            />
            <ErrorMsg msg={getErrorMessage("languages")}/>

            <Button variant="contained" type="submit">
                Submit
            </Button>
        </form>
        <Button variant="contained" onClick={handleClose}>
            Close
        </Button>
    </ScrollableModal>
}



