import { CircularProgress } from '@mui/material';
import React from 'react';
import Box from '@mui/material/Box';

/**
 * Show as inline-block to prevent wobbling of spinner icon
 */
export function CenteredSpinner(props: { label?: string }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <div>
        <p style={{ textAlign: 'center' }}>
          <CircularProgress
            style={{
              fontSize: '2em',
              opacity: '0.25',
            }}
          />
        </p>
        {props.label && (
          <p style={{ textAlign: 'center', opacity: '0.75' }}>{props.label}</p>
        )}
      </div>
    </Box>
  );
}
