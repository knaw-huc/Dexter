import React from 'react';
import { Label } from '../common/Label';
import { ErrorMsg } from '../common/ErrorMsg';
import { TextFieldStyled } from './TextFieldStyled';
import { TextareaFieldProps } from '../common/TextareaFieldProps';

export type TextFormFieldProps = TextareaFieldProps & {
  label: string;
  message?: string;
  value?: string;
  onChange: (change?: string) => void;
  variant?: 'standard';
};

/**
 * Text field with label and error handling
 */
export function TextFieldWithError(props: TextFormFieldProps) {
  const { label, message, onChange, value, ...textFieldProps } = props;
  return (
    <>
      <Label style={{ textTransform: 'capitalize' }}>{label}</Label>
      {message && <ErrorMsg msg={message} />}
      <TextFieldStyled
        {...textFieldProps}
        fullWidth={true}
        error={!!message}
        value={value ?? ''}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value || undefined);
        }}
      />
    </>
  );
}
