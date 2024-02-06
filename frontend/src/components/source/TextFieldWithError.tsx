import React, { useRef } from 'react';
import { Label } from '../common/Label';
import { StandardTextFieldProps } from '@mui/material/TextField';
import { CustomFieldProps } from '../common/CustomFieldProps';
import { ErrorMsg } from '../common/ErrorMsg';
import { TextFieldStyled } from './TextFieldStyled';

type TextFormFieldProps = StandardTextFieldProps &
  CustomFieldProps & {
    variant?: 'standard';
  };

/**
 * Text field with label and error handling
 * use forwardRef to register field with react-hook-form
 */
export function TextFieldWithError(props: TextFormFieldProps) {
  const { label, message } = props;
  const fieldRef = useRef(null);
  return (
    <span ref={fieldRef}>
      <Label style={{ textTransform: 'capitalize' }}>{label}</Label>
      {message && <ErrorMsg msg={message} />}
      <TextFieldStyled
        fullWidth={true}
        margin="dense"
        error={!!message}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(event);
        }}
      />
    </span>
  );
}
