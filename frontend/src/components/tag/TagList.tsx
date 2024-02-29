import { ResultTag } from '../../model/DexterModel';
import { Stack } from '@mui/material';
import { ResourceChip } from './ResourceChip';
import React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles/createTheme';

export function TagList(props: {
  tags: ResultTag[];
  sx?: SxProps<Theme>;
  onDelete?: (tag: ResultTag) => void;
}) {
  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        ...props.sx,
        m: '0',
        display: 'inline-block',
        lineHeight: '2em',
      }}
    >
      {props.tags.map((tag: ResultTag, index: number) =>
        props.onDelete ? (
          <ResourceChip
            key={index}
            text={tag.val}
            onDelete={() => props.onDelete && props.onDelete(tag)}
          />
        ) : (
          <ResourceChip key={index} text={tag.val} />
        ),
      )}
    </Stack>
  );
}
