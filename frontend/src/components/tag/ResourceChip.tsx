import Chip from '@mui/material/Chip';
import React, { ReactNode } from 'react';
import { Theme } from '@mui/material/styles/createTheme';
import { SxProps } from '@mui/system';

export function ResourceChip(props: {
  label: ReactNode;
  onDelete?: () => void;
  sx?: SxProps<Theme>;
}) {
  return (
    <Chip
      label={props.label}
      variant="outlined"
      onDelete={props.onDelete}
      sx={{
        marginLeft: '0 !important',
        marginRight: '0.4em !important',
        ...props.sx,
      }}
      size="small"
    />
  );
}
