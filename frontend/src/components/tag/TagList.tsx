import { ResultKeyword } from '../../model/DexterModel';
import { Stack } from '@mui/material';
import { TagChip } from './TagChip';
import React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles/createTheme';

export function TagList(props: {
  keywords: ResultKeyword[];
  sx?: SxProps<Theme>;
  onDelete?: (keyword: ResultKeyword) => void;
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
      {props.keywords?.map((keyword: ResultKeyword, index: number) =>
        props.onDelete ? (
          <TagChip
            key={index}
            keyword={keyword}
            onDelete={() => props.onDelete && props.onDelete(keyword)}
          />
        ) : (
          <TagChip key={index} keyword={keyword} />
        ),
      )}
    </Stack>
  );
}
