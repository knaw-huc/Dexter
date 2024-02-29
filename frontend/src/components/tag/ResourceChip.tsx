import Chip from '@mui/material/Chip';
import React from 'react';

export function ResourceChip(props: { text: string; onDelete?: () => void }) {
  return (
    <Chip
      label={props.text}
      variant="outlined"
      onDelete={props.onDelete}
      sx={{
        marginLeft: '0 !important',
        marginRight: '0.4em !important',
      }}
      size="small"
    />
  );
}
