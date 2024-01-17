import React, {forwardRef, useEffect, useRef} from "react"
import {Label} from "../common/Label"
import {StandardTextFieldProps} from "@mui/material/TextField"
import {UseFormRegisterReturn} from "react-hook-form"
import {CustomFieldProps} from "../common/CustomFieldProps"
import {ErrorMsg} from "../common/ErrorMsg"
import {TextFieldStyled} from "./TextFieldStyled"
import {Button, Grid, Tooltip} from "@mui/material"
import {HelpIconStyled} from "../common/HelpIconStyled"

type TextFormFieldProps = StandardTextFieldProps & UseFormRegisterReturn<string> & CustomFieldProps & {
    variant?: "standard",
    onImport: () => void,
    canImport: boolean
};

export const ImportField = forwardRef<
    typeof TextFieldStyled,
    TextFormFieldProps
>(function TextWithLabelErrorField(
    props,
    ref
) {
    const {label, message, ...textFieldProps} = props
    const fieldRef = useRef(null);
    useEffect(() => {
        if(message) {
            fieldRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [message, fieldRef.current])

    return <div
        ref={fieldRef}
    >
        <Label
            style={{textTransform: "capitalize"}}
        >
            {label}
        </Label>

        <Grid container spacing={2}>
            <Grid item xs={10}>
                <TextFieldStyled
                    {...textFieldProps}
                    error={!!message}
                    onChange={textFieldProps.onChange}
                    onBlur={textFieldProps.onBlur}
                    inputRef={ref}
                    fullWidth
                />
            </Grid>

            <Grid item xs={2} alignItems="stretch" style={{display: "flex"}}>
                <Button
                    disabled={!props.canImport}
                    fullWidth
                    variant="contained"
                    onClick={props.onImport}
                >
                    Import
                    <Tooltip title="Import and fill out found form fields with metadata from external reference">
                        <HelpIconStyled />
                    </Tooltip>
                </Button>
            </Grid>
        </Grid>
        {message && <ErrorMsg msg={message}/>}
    </div>
})