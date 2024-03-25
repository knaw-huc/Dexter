import React from 'react';
import { Label } from '../common/Label';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Button, Tooltip } from '@mui/material';
import { HelpIcon } from '../common/HelpIcon';
import { SplitRow } from '../common/SplitRow';
import { TextFormFieldProps } from '../common/TextFieldWithError';
import { FieldError } from '../common/error/FieldError';
import { FormFieldprops } from '../common/FormFieldProps';
import { SpinnerIcon } from '../common/SpinnerIcon';

type ImportFieldProps = FormFieldprops &
  Omit<TextFormFieldProps, 'label'> & {
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
      {label && <Label>{label}</Label>}

      <SplitRow
        left={
          <TextFieldStyled
            {...textFieldProps}
            error={!!error}
            fullWidth
            value={value ?? ''}
            onChange={e => onChange(e.target.value || undefined)}
          />
        }
        right={
          <Button
            disabled={!isRefImportable || isImporting}
            fullWidth
            variant="contained"
            onClick={onImport}
          >
            Import
            {isImporting ? <SpinnerIcon /> : <ImportToolTipHelp />}
          </Button>
        }
      />
      <FieldError error={error} />
    </div>
  );
}

function ImportToolTipHelp() {
  return (
    <Tooltip title="Import and fill out found form fields with metadata from external reference">
      <HelpIcon />
    </Tooltip>
  );
}
