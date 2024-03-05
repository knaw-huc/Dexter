import { Alert, AlertProps, Theme } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMessage';
import React from 'react';
import { CloseInlineIcon } from './CloseInlineIcon';
import { SxProps } from '@mui/system';

export function ErrorAlert(props: {
  message: string;
  onClose?: () => void;
  sx?: SxProps<Theme>;
}) {
  const optionalCloseButton: Partial<AlertProps> = {};
  if (props.onClose) {
    optionalCloseButton.action = <CloseInlineIcon onClick={props.onClose} />;
  }
  return (
    <Alert
      className={ERROR_MESSAGE_CLASS}
      severity="error"
      sx={props.sx}
      {...optionalCloseButton}
    >
      An error occurred: {props.message}
    </Alert>
  );
}
