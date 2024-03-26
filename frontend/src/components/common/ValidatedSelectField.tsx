import React from 'react';
import { FormControl, MenuItem, Select, SelectProps } from '@mui/material';
import { Label } from './Label';
import { ErrorWithMessage } from './error/ErrorWithMessage';
import { FieldError } from './error/FieldError';
import { FormFieldprops } from './FormFieldProps';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type SelectFieldProps<T> = FormFieldprops &
  Omit<SelectProps, 'error' | 'variant'> & {
    error?: ErrorWithMessage;
    onSelectOption: (selected: T) => void;
    selectedOption: string;
    options: string[];
    sx?: SxProps<Theme>;
  };

export function ValidatedSelectField<T>(props: SelectFieldProps<T>) {
  const { options, label, error, selectedOption, onSelectOption } = props;

  return (
    <>
      <FormControl fullWidth disabled={props.disabled} sx={props.sx}>
        {label && <Label>{label}</Label>}
        <Select
          size={props.size}
          value={selectedOption || 'placeholder'}
          onChange={e => {
            return onSelectOption(e.target.value as T);
          }}
          sx={{ height: props.size === 'small' ? '2.3em' : 'initial' }}
        >
          <MenuItem value="placeholder" disabled={true}>
            {props.placeholder || 'Please pick an option'}
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
