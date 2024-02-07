import React, { forwardRef, useEffect, useRef } from 'react';
import { Label } from '../common/Label';
import { StandardTextFieldProps } from '@mui/material/TextField';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ErrorMsg } from '../common/ErrorMsg';
import { TextFieldStyled } from './TextFieldStyled';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { HelpIconStyled } from '../common/HelpIconStyled';
import { InputButtonGrid } from '../common/InputButtonGrid';

type ImportFieldProps = StandardTextFieldProps &
  UseFormRegisterReturn<string> & {
    message?: string;
    variant?: 'standard';
    onImport: () => void;
    isRefImportable: boolean;
    isImporting: boolean;
  };

export const ImportField = forwardRef<typeof TextFieldStyled, ImportFieldProps>(
  function TextWithLabelErrorField(props, ref) {
    const {
      label,
      message,
      onImport,
      isRefImportable,
      isImporting,
      ...textFieldProps
    } = props;
    const fieldRef = useRef(null);
    useEffect(() => {
      if (message) {
        fieldRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, [message, fieldRef.current]);

    return (
      <div ref={fieldRef}>
        <Label style={{ textTransform: 'capitalize' }}>{label}</Label>

        <InputButtonGrid
          input={
            <TextFieldStyled
              {...textFieldProps}
              error={!!message}
              inputRef={ref}
              fullWidth
            />
          }
          button={
            <Button
              disabled={!isRefImportable || isImporting}
              fullWidth
              variant="contained"
              onClick={onImport}
            >
              Import
              {isImporting ? <Spinner /> : <ImportToolTipHelp />}
            </Button>
          }
        />
        {message && <ErrorMsg msg={message} />}
      </div>
    );
  },
);

/**
 * Add div to prevent wobbling
 */
function Spinner() {
  return (
    <div>
      <CircularProgress
        style={{
          width: '17px',
          height: '17px',
          marginLeft: '0.25em',
          marginTop: '0.5em',
        }}
      />
    </div>
  );
}

function ImportToolTipHelp() {
  return (
    <Tooltip title="Import and fill out found form fields with metadata from external reference">
      <HelpIconStyled />
    </Tooltip>
  );
}
