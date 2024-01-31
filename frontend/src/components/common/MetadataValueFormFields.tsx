import React, {ChangeEvent, useState} from "react"
import {createMetadataValue} from "../../utils/API"
import {FormMetadataValue, ResultMetadataKey} from "../../model/DexterModel"
import {Button, FormControl, Select} from "@mui/material"
import {Label} from "./Label"
import {InputButtonGrid} from "./InputButtonGrid"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import {DeleteIconStyled} from "./DeleteIconStyled"

type MetadataValueFormFieldsProps = {
    keys: ResultMetadataKey[],
    values: FormMetadataValue[]
    onChange: (values: FormMetadataValue[]) => void
}

const NONE_SELECTED = "none-selected"

export function MetadataValueFormFields(props: MetadataValueFormFieldsProps) {

    const [selectedKeyId, setSelectedKeyId] = useState(NONE_SELECTED)

    async function handleCreateField() {
        console.log("Create metadata value field", selectedKeyId)
        const created = await createMetadataValue({
            keyId: selectedKeyId,
            value: ""
        })
        const update = [...props.values, created]
        setSelectedKeyId(NONE_SELECTED)
        props.onChange(update)
    }

    async function handleDelete(toDelete: FormMetadataValue) {
        const warning = window.confirm(
            "Are you sure you want to delete this metadata field?"
        )

        if (warning === false) return

        const update = props.values.filter(v => v.keyId !== toDelete.keyId)
        props.onChange(update)
    }

    function handleChangeFormValue(
        changed: FormMetadataValue,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const update = props.values?.map(fv => fv.keyId === changed.keyId ? {
            keyId: changed.keyId,
            value: event.target.value
        } : fv)
        props.onChange(update)
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
            {props.values.map((value, i) => <div key={i}>
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