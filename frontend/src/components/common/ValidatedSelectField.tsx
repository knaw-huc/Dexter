import React, {forwardRef} from "react"
import {FormControl, MenuItem, Select, SelectProps} from "@mui/material"
import {CustomFieldProps} from "./CustomFieldProps"
import {Label} from "./Label"
import {ErrorMsg} from "./ErrorMsg"
import {Access} from "../../model/DexterModel"

export type SelectFieldProps = SelectProps & CustomFieldProps & {
    onSelectOption: (selected: Access) => void
    selectedOption: string,
    options: string[]
};

export function ValidatedSelectField(props: SelectFieldProps) {
    const {options, label, message, selectedOption, onSelectOption} = props

    return <>
        <FormControl fullWidth>
            <Label>
                {label}
            </Label>
            <Select
                value={selectedOption || "placeholder"}
                onChange={(e) => {
                    return onSelectOption(e.target.value as Access)
                }}
            >
               <MenuItem
                    value="placeholder"
                   disabled={true}
                >
                    Please select an option level
                </MenuItem>
                {options.map(v => (
                    <MenuItem
                        key={v}
                        value={v}
                    >{v}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <ErrorMsg msg={message}/>
    </>
}