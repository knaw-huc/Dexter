import Button from '@mui/material/Button';
import React, { ReactNode } from 'react';
import { SubmitOnEnter } from './SubmitOnEnter';

export function SubmitButton(props: {
  label?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <>
      <SubmitOnEnter />
      <Button
        variant="contained"
        type={props.onClick ? 'button' : 'submit'}
        style={{ marginTop: '1em' }}
        onClick={props.onClick}
      >
        {props.label ?? 'Submit'}
      </Button>
    </>
  );
}
