import React, {forwardRef, useEffect, useRef} from "react"
import {Label} from "../common/Label"
import {StandardTextFieldProps} from "@mui/material/TextField"
import {UseFormRegisterReturn} from "react-hook-form"
import {CustomFieldProps} from "../common/CustomFieldProps"
import {ErrorMsg} from "../common/ErrorMsg"
import {TextFieldStyled} from "./TextFieldStyled"
import {Button, CircularProgress, Grid, Tooltip} from "@mui/material"
import {HelpIconStyled} from "../common/HelpIconStyled"

type ImportFieldProps = StandardTextFieldProps & UseFormRegisterReturn<string> & CustomFieldProps & {
    variant?: "standard",
    onImport: () => void,
    isRefImportable: boolean
    isImporting: boolean
};

export const ImportField = forwardRef<
    typeof TextFieldStyled,
    ImportFieldProps
>(function TextWithLabelErrorField(
    props,
    ref
) {
    const {
        label,
        message,
        onImport,
        isRefImportable,
        isImporting,
        ...textFieldProps
    } = props
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
                    inputRef={ref}
                    fullWidth
                />
            </Grid>

            <Grid item xs={2} alignItems="stretch" style={{display: "flex"}}>
                <Button
                    disabled={!isRefImportable || isImporting}
                    fullWidth
                    variant="contained"
                    onClick={onImport}
                >
                    Import
                    {isImporting
                        ? <Spinner/>
                        : <ImportToolTipHelp/>
                    }
                </Button>
            </Grid>
        </Grid>
        {message && <ErrorMsg msg={message}/>}
    </div>
})

/**
 * Add div to prevent wobbling
 */
function Spinner() {
    return <div>
        <CircularProgress
            style={{
                width: "17px",
                height: "17px",
                marginLeft: "0.25em",
                marginTop: "0.5em"
            }}
        />
    </div>
}

function ImportToolTipHelp() {
    return <Tooltip
        title="Import and fill out found form fields with metadata from external reference"
    >
        <HelpIconStyled/>
    </Tooltip>
}

