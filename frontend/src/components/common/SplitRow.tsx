import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';

/**
 * Align button next to an input field
 */
export function SplitRow(props: {
  left: ReactNode;
  right: ReactNode;
  leftWidth?: number;
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={props.leftWidth || 10}>
        {props.left}
      </Grid>
      <Grid
        item
        xs={12 - props.leftWidth || 2}
        alignItems="stretch"
        style={{ display: 'flex' }}
      >
        {props.right}
      </Grid>
    </Grid>
  );
}
