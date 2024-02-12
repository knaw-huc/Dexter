import React from 'react';
import { Label } from '../common/Label';
import { ErrorMessage } from '../common/ErrorMessage';
import { TextFieldStyled } from './TextFieldStyled';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { HelpIconStyled } from '../common/HelpIconStyled';
import { InputButtonGrid } from '../common/InputButtonGrid';
import { TextFormFieldProps } from './TextFieldWithError';

type ImportFieldProps = TextFormFieldProps & {
  onImport: () => void;
  isRefImportable: boolean;
  isImporting: boolean;
};

export function ImportField(props: ImportFieldProps) {
  const {
    label,
    error,
    onImport,
    isRefImportable,
    isImporting,
    value,
    onChange,
    ...textFieldProps
  } = props;

  return (
    <div>
      <Label style={{ textTransform: 'capitalize' }}>{label}</Label>

      <InputButtonGrid
        input={
          <TextFieldStyled
            {...textFieldProps}
            error={!!error}
            fullWidth
            value={value}
            onChange={e => onChange(e.target.value)}
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
      {error && <ErrorMessage error={error} />}
    </div>
  );
}

/**
 * Add div to prevent wobbling of spinner icon
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
