import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';

/**
 * Align button next to an input field
 */
export function InputButtonGrid(props: {
  input: ReactNode;
  button: ReactNode;
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        {props.input}
      </Grid>
      <Grid item xs={2} alignItems="stretch" style={{ display: 'flex' }}>
        {props.button}
      </Grid>
    </Grid>
  );
}
