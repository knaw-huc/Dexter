import styled from "@emotion/styled"
import TextField from "@mui/material/TextField"
import React, {ChangeEvent, useEffect, useState} from "react"
import {FormMetadataKey, ResultMetadataKey,} from "../../model/DexterModel"
import {createMetadataKey, updateMetadataKey} from "../../utils/API"
import ScrollableModal from "../common/ScrollableModal"
import {ErrorByField, FormError, GENERIC, scrollToError} from "../common/FormError"
import {CloseInlineIcon} from "../common/CloseInlineIcon"
import {SubmitButton} from "../common/SubmitButton"
import {ErrorMsg} from "../common/ErrorMsg"
import {Label} from "../common/Label"

type MetadataKeyFormProps = {
    inEdit?: ResultMetadataKey,
    onSaved: (edited: ResultMetadataKey) => void,
    onClose: () => void,
};
styled(TextField)`
  display: block;
`

function validateData(form: FormMetadataKey): ErrorByField | undefined {
    if (!form.key) {
        return {field: "key", error: {message: "Cannot be empty"}}
    }
}

export function MetadataKeyForm(props: MetadataKeyFormProps) {

    const [fieldError, setFieldError] = useState<ErrorByField>()
    const [keyField, setKeyField] = useState("")

    const [isInit, setInit] = useState(false)

    useEffect(() => {
        const initFormFields = async () => {
            setKeyField(props.inEdit?.key || "")
        }
        if (!isInit) {
            setInit(true)
            initFormFields()
        }
    }, [isInit])

    useEffect(() => {
        if (fieldError) {
            scrollToError()
        }
    }, [fieldError])

    async function createNewMetadataKey(
        data: FormMetadataKey
    ) {
        const newMetadataKey = await createMetadataKey(data)
        return newMetadataKey.id
    }

    async function updateExistingMetadataKey(
        data: FormMetadataKey
    ) {
        const metadataKeyId = props.inEdit.id
        await updateMetadataKey(metadataKeyId, data)
        return metadataKeyId
    }

    async function handleSubmit() {
        const data: FormMetadataKey = {key: keyField}
        const foundError = validateData(data)
        if (foundError) {
            setFieldError(foundError)
            return
        }
        try {
            const id = props.inEdit
                ? await updateExistingMetadataKey(data)
                : await createNewMetadataKey(data)
            props.onSaved({id, ...data})
        } catch (error) {
            setFieldError({field: GENERIC, error})
        }
    }

    return (
        <>
            <ScrollableModal
                show={true}
                handleClose={props.onClose}
            >
                <CloseInlineIcon
                    style={{float: "right", top: 0}}
                    onClick={props.onClose}
                />

                <h1>
                    {props.inEdit
                        ? "Edit metadata field"
                        : "Create new metadata field"
                    }
                </h1>
                <form>

                    <FormError error={fieldError}/>

                    <Label>Metadata field</Label>
                    {fieldError?.field === "key" &&
                        <ErrorMsg msg={fieldError.error.message}/>
                    }
                    <TextField
                        fullWidth
                        value={keyField}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setKeyField(event.currentTarget.value)
                        }}
                    />

                    <SubmitButton
                        onClick={() => handleSubmit()}
                    />
                </form>
            </ScrollableModal>
        </>
    )
}
