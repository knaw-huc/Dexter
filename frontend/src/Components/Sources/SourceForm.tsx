import React, {useEffect, useState} from "react"
import {useForm, UseFormRegisterReturn} from "react-hook-form"
import styled from "@emotion/styled"
import {createSource, getSourceById, postImport, updateSource} from "../../utils/API"
import {Access, Source} from "../../Model/DexterModel"
import TextField from "@mui/material/TextField"
import {useDebounce} from "../../utils/useDebounce"
import isUrl from "../../utils/isUrl"
import {Alert} from "@mui/material"
import Button from "@mui/material/Button"
import ScrollableModal from "../Common/ScrollableModal"

type NewSourceProps = {
    refetch?: () => void,
    show?: boolean,
    onClose?: () => void,
    edit?: boolean,
    sourceToEdit?: Source,
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
  text-transform: capitalize;
`

const Option = styled.option`
  text-transform: capitalize;
`

export function SourceForm(props: NewSourceProps) {
    const {register, handleSubmit, reset, setValue, watch} = useForm<Source>()
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

    async function onSubmit(source: Source) {
        if (props.edit) {
            await submitUpdate(source)
        } else {
            await submitNew(source)
        }
    }

    async function submitUpdate(data: Source) {
        await updateSource(props.sourceToEdit.id, data)
            .catch(setExternalRefError)
        props.refetchSource()
    }

    async function submitNew(data: Source) {
        await createSource(data)
            .catch(setExternalRefError)
        props.refetch()
        props.onClose()
    }

    useEffect(() => {
        initSourceForm()

        async function initSourceForm() {
            if (!props.edit) {
                return
            }
            const id = props.sourceToEdit.id
            getSourceById(id)
                .then(reset)
                .catch(setExternalRefError)
        }
    }, [props.edit, setValue])

    const handleClose = () => {
        props.onClose()
        if (props.edit) {
            props.onEdit(false)
        }
        reset()
    }

    return <ScrollableModal
        show={props.show}
        handleClose={handleClose}
    >
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label>External reference</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("externalRef")} />
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
            <TextFieldStyled fullWidth margin="dense" {...register("title", {required: true})} />
            <Label>Description</Label>
            <TextFieldStyled fullWidth margin="dense" multiline rows={6} {...register("description", {required: true})} />
            <Label>Rights</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("rights", {required: true})} />
            <Label>Access</Label>
            <AccessSelectionField
                registered={{...register("access", {required: true})}}
            />
            <Label>Location</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("location")} />
            <Label>Earliest</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("earliest")} />
            <Label>Latest</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("latest")} />
            <Label>Notes</Label>
            <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
            <Button variant="contained" type="submit">Submit</Button>
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