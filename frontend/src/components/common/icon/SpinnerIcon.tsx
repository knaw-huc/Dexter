import { CircularProgress } from '@mui/material';
import React from 'react';

/**
 * Show as inline-block to prevent wobbling of spinner icon
 */
export function SpinnerIcon() {
  return (
    <span style={{ display: 'inline-block' }}>
      <CircularProgress
        style={{
          width: '17px',
          height: '17px',
          marginLeft: '0.25em',
          marginTop: '0.5em',
        }}
      />
    </span>
  );
}
