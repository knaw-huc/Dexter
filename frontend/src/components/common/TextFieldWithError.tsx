import React, { ReactNode } from 'react';
import { Label } from './Label';
import { FieldError } from './error/FieldError';
import { TextFieldStyled } from './TextFieldStyled';
import { TextareaFieldProps } from './TextareaFieldProps';
import { ErrorWithMessage } from './error/ErrorWithMessage';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type TextFormFieldProps = TextareaFieldProps & {
  label: ReactNode;
  error?: ErrorWithMessage;
  value: string | undefined;
  onChange: (change?: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  variant?: 'standard';
  sx?: SxProps<Theme>;
};

/**
 * Text field with label and error handling
 */
export function TextFieldWithError(props: TextFormFieldProps) {
  const { label, error, onChange, value, ...textFieldProps } = props;
  return (
    <>
      {label && <Label>{label}</Label>}
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
      />
    </>
  );
}
