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
    const {label, errorMessage, ...textFieldProps} = props
    const fieldRef = useRef(null);
    useEffect(() => {
        if(errorMessage) {
            fieldRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [errorMessage, fieldRef.current])

    return <span
        ref={fieldRef}
    >
        <Label
            style={{textTransform: "capitalize"}}
        >
            {label}
        </Label>
        <TextFieldStyled
            fullWidth={true}
            margin="dense"
            error={!!errorMessage}

            name={textFieldProps.name}
            onChange={textFieldProps.onChange}
            onBlur={textFieldProps.onBlur}
            inputRef={ref}
        />
        {errorMessage && <ErrorMsg msg={errorMessage}/>}
    </span>
})