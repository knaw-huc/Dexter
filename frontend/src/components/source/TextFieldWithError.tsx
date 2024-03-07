import React from 'react';
import { Label } from '../common/Label';
import { FieldError } from '../common/error/FieldError';
import { TextFieldStyled } from './TextFieldStyled';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { InputBaseProps } from '@mui/material/InputBase';
import { InputProps as StandardInputProps } from '@mui/material/Input/Input';

export type TextFormFieldProps = TextareaFieldProps & {
  label: string;
  error?: ErrorWithMessage;
  value: string | undefined;
  onChange: (change?: string) => void;
  onFocus?: () => void;
  variant?: 'standard';
  sx?: SxProps<Theme>;

  // Difference between inputProps and InputProps: https://stackoverflow.com/a/69872110/2938059
  inputProps?: InputBaseProps['inputProps'];
  InputProps?: Partial<StandardInputProps>;
};

/**
 * Text field with label and error handling
 */
export function TextFieldWithError(props: TextFormFieldProps) {
  const { label, error, onChange, value, ...textFieldProps } = props;
  return (
    <>
      {props.label && <Label>{label}</Label>}
      {error && <FieldError error={error} />}
      <TextFieldStyled
        {...textFieldProps}
        fullWidth={true}
        error={!!error}
        value={value ?? ''}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value || undefined);
        }}
        sx={props.sx}
        onFocus={props.onFocus}
      />
    </>
  );
}
