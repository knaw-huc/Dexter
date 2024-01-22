import React, {forwardRef, useEffect, useRef} from "react"
import {Label} from "../common/Label"
import {StandardTextFieldProps} from "@mui/material/TextField"
import {UseFormRegisterReturn} from "react-hook-form"
import {CustomFieldProps} from "../common/CustomFieldProps"
import {ErrorMsg} from "../common/ErrorMsg"
import {TextFieldStyled} from "./TextFieldStyled"

type TextFormFieldProps = StandardTextFieldProps & UseFormRegisterReturn<string> & CustomFieldProps & {
    variant?: "standard"
};

/**
 * Text field with label and error handling
 * use forwardRef to register field with react-hook-form
 */
export const TextFieldWithError = forwardRef<
    typeof TextFieldStyled,
    TextFormFieldProps
>(function TextWithLabelErrorField(
    props,
    ref
) {
    const {label, message, ...textFieldProps} = props
    const fieldRef = useRef(null);
    return <span
        ref={fieldRef}
    >
        <Label
            style={{textTransform: "capitalize"}}
        >
            {label}
        </Label>
        {message && <ErrorMsg msg={message}/>}
        <TextFieldStyled
            {...textFieldProps}

            fullWidth={true}
            margin="dense"
            error={!!message}

            onChange={textFieldProps.onChange}
            onBlur={textFieldProps.onBlur}
            inputRef={ref}
        />
    </span>
})