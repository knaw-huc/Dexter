import Button from '@mui/material/Button';
import React from 'react';

export function CloseButton(props: { onClose: () => void }) {
  return (
    <Button
      variant="contained"
      onClick={props.onClose}
      style={{ marginTop: '1em' }}
    >
      Close
    </Button>
  );
}
