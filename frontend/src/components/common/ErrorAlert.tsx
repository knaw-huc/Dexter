import { Alert, AlertProps } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMessage';
import React from 'react';
import { CloseInlineIcon } from './CloseInlineIcon';

export function ErrorAlert(props: { message: string; onClose?: () => void }) {
  const optionalCloseButton: Partial<AlertProps> = {};
  if (props.onClose) {
    optionalCloseButton.action = <CloseInlineIcon onClick={props.onClose} />;
  }
  return (
    <Alert
      className={ERROR_MESSAGE_CLASS}
      severity="error"
      {...optionalCloseButton}
    >
      An error occurred: {props.message}
    </Alert>
  );
}
