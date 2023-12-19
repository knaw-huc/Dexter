import styled from "@emotion/styled"
import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import React, {useState} from "react"
import {SubmitHandler, useForm, UseFormRegisterReturn} from "react-hook-form"
import * as yup from "yup"
import {Access, ServerCorpus, ServerKeyword, ServerLanguage, ServerSource, Source,} from "../../model/DexterModel"
import {sourcesContext} from "../../state/sources/sourcesContext"
import {AccessField} from "../access/AccessField"
import {
    addKeywordsToSource,
    addLanguagesToSource,
    createSource,
    getKeywordsSources,
    getLanguagesSources,
    getSourceById,
    updateSource,
} from "../API"
import ScrollableModal from "../common/ScrollableModal"
import {KeywordsField} from "../keywords/KeywordsField"
import {LanguagesField} from "../languages/LanguagesField"
import {Alert} from "@mui/material"
import {postImport} from "../../utils/API"
import isUrl from "../../utils/isUrl"
import {useDebounce} from "../../utils/useDebounce"

type NewSourceProps = {
    refetch?: () => void;
    show?: boolean;
    onClose?: () => void;
    edit?: boolean;
    sourceToEdit?: ServerSource | undefined;
    onEdit?: (boolean: boolean) => void;
    refetchSource?: () => void;
};

const TextFieldStyled = styled(TextField)`
  display: block;
`

const Label = styled.label`
  font-weight: bold;
`
const Select = styled.select`
  display: block;
  text-transform: capitalize;
`

const Option = styled.option`
  text-transform: capitalize;
`

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    creator: yup.string().required("Creator is required"),
    rights: yup.string().required("Rights is required"),
    access: yup.string().required("Access is required"),
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

    console.log(newData)
    return newData
}

export function SourceForm(props: NewSourceProps) {
    const {sources} = React.useContext(sourcesContext)
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

    const onSubmit: SubmitHandler<ServerSource> = async (data) => {
        console.log(data)

        if (!props.edit) {
            const dataToServer = formToServer(data)
            try {
                const newSource = await createSource(dataToServer)
                const sourceId = newSource.id
                dataToServer.keywords &&
                (await addKeywordsToSource(sourceId, dataToServer.keywords))
                dataToServer.languages &&
                (await addLanguagesToSource(sourceId, dataToServer.languages))
                await props.refetch()
            } catch (error) {
                console.log(error)
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

            const doUpdateSource = async (id: string, updatedData: ServerSource) => {
                try {
                    await updateSource(id, updatedData)
                    await addKeywordsToSource(id, updatedDataToServer.keywords)
                    await addLanguagesToSource(id, updatedDataToServer.languages)
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
            const languages = await getLanguagesSources(id)

            data.keywords = keywords.map((keyword) => {
                return keyword
            })
            data.languages = languages.map((language) => {
                return language
            })

            data.access = data.access.charAt(0).toUpperCase() + data.access.slice(1)

            const fields = [
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

    return <ScrollableModal
        show={props.show}
        handleClose={handleClose}
    >
        <h1>Create new source</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label>External reference</Label>
            <TextFieldStyled
                fullWidth
                margin="dense"
                {...register("externalRef")}
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
            <Label>Title</Label>
            <TextFieldStyled
                fullWidth
                margin="dense"
                error={errors.title ? true : false}
                {...register("title", {required: true})}
            />
            <p style={{color: "red"}}>{errors.title?.message}</p>
            <Label>Description</Label>
            <TextFieldStyled
                fullWidth
                margin="dense"
                multiline
                rows={6}
                error={errors.description ? true : false}
                {...register("description", {required: true})}
            />
            <p style={{color: "red"}}>{errors.description?.message}</p>
            <Label>Creator</Label>
            <TextFieldStyled
                fullWidth
                margin="dense"
                error={errors.creator ? true : false}
                {...register("creator", {required: true})}
            />
            <p style={{color: "red"}}>{errors.creator?.message}</p>
            <Label>Rights</Label>
            <TextFieldStyled
                fullWidth
                margin="dense"
                error={errors.rights ? true : false}
                {...register("rights", {required: true})}
            />
            <p style={{color: "red"}}>{errors.rights?.message}</p>
            <Label>Access</Label>
            <AccessField control={control} edit={sources.editSourceMode}/>

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
            <Label>Notes</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
            <Label>Keywords</Label>
            <KeywordsField
                control={control}
                sourceId={props.sourceToEdit && props.sourceToEdit.id}
                setValueSource={setValue}
                edit={sources.editSourceMode}
            />
            <Label>Languages</Label>
            <LanguagesField
                control={control}
                sourceId={props.sourceToEdit && props.sourceToEdit.id}
                setValueSource={setValue}
                edit={sources.editSourceMode}
            />
            <Button variant="contained" type="submit">
                Submit
            </Button>
        </form>
        <Button variant="contained" onClick={handleClose}>
            Close
        </Button>
    </ScrollableModal>
}

export function AccessSelectionField(props: { registered: UseFormRegisterReturn }) {
    const options = Object
        .values(Access)
    return <Select {...props.registered}>
        {options.map(access => <Option
            key={access}
            value={access}
        >
            {access}
        </Option>)
        }
    </Select>
}