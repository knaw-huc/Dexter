import React from 'react';
import { Label } from '../common/Label';
import { FieldError } from '../common/error/FieldError';
import { TextFieldStyled } from './TextFieldStyled';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';

export type TextFormFieldProps = TextareaFieldProps & {
  label: string;
  error?: ErrorWithMessage;
  value?: string;
  onChange: (change?: string) => void;
  variant?: 'standard';
};

/**
 * Text field with label and error handling
 */
export function TextFieldWithError(props: TextFormFieldProps) {
  const { label, error, onChange, value, ...textFieldProps } = props;
  return (
    <>
      <Label>{label}</Label>
      {error && <FieldError error={error} />}
      <TextFieldStyled
        {...textFieldProps}
        fullWidth={true}
        error={!!error}
        value={value ?? ''}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value || undefined);
        }}
      />
    </>
  );
}
