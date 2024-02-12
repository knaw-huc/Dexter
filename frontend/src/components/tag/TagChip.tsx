import { ResultTag } from '../../model/DexterModel';
import Chip from '@mui/material/Chip';
import React from 'react';

export function TagChip(props: { tag: ResultTag; onDelete?: () => void }) {
  return (
    <Chip
      label={props.tag.val}
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
