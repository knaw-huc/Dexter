import React from 'react';
import { ButtonWithIcon } from '../common/icon/ButtonWithIcon';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { ExportIcon } from './ExportIcon';
import { OkIcon } from '../common/icon/OkIcon';

export function ExportButton(props: {
  onExport: () => void;
  isExported: boolean;
  sx?: SxProps<Theme>;
}) {
  return (
    <ButtonWithIcon
      disabled={props.isExported}
      variant="contained"
      onClick={props.onExport}
      style={{ float: 'right' }}
      sx={props.sx}
    >
      {props.isExported ? <OkIcon sx={{ mr: '0.5em' }} /> : <ExportIcon />}
      {props.isExported ? 'Exported' : 'Export'}
    </ButtonWithIcon>
  );
}
