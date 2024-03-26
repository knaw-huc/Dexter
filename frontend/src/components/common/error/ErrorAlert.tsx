import { Alert, AlertProps, Theme } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './FieldError';
import React from 'react';
import { SxProps } from '@mui/system';

import { TopRightCloseIcon } from '../icon/CloseIcon';

export function ErrorAlert(props: {
  message: string;
  onClose?: () => void;
  sx?: SxProps<Theme>;
  severity?: 'error' | 'warning';
}) {
  const optionalCloseButton: Partial<AlertProps> = {};
  if (props.onClose) {
    optionalCloseButton.action = <TopRightCloseIcon onClick={props.onClose} />;
  }
  if (!props.message) {
    return;
  }
  return (
    <Alert
      className={ERROR_MESSAGE_CLASS}
      severity={props.severity || 'error'}
      sx={{
        marginBottom: '1em',
        ...props.sx,
      }}
      {...optionalCloseButton}
    >
      {props.message}
    </Alert>
  );
}
