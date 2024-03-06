import React from 'react';
import { FormControl, MenuItem, Select, SelectProps } from '@mui/material';
import { Label } from './Label';
import { Access } from '../../model/DexterModel';
import { ErrorWithMessage } from './error/ErrorWithMessage';
import { FieldError } from './error/FieldError';
import { FormFieldprops } from './FormFieldProps';

export type SelectFieldProps = FormFieldprops &
  Omit<SelectProps, 'error' | 'variant'> & {
    error?: ErrorWithMessage;
    onSelectOption: (selected: Access) => void;
    selectedOption: string;
    options: string[];
  };

export function ValidatedSelectField(props: SelectFieldProps) {
  const { options, label, error, selectedOption, onSelectOption } = props;

  return (
    <>
      <FormControl fullWidth>
        <Label>{label}</Label>
        <Select
          value={selectedOption || 'placeholder'}
          onChange={e => {
            return onSelectOption(e.target.value as Access);
          }}
        >
          <MenuItem value="placeholder" disabled={true}>
            Please select an option level
          </MenuItem>
          {options.map(v => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FieldError error={error} />
    </>
  );
}
