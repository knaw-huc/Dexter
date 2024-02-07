import { ResultKeyword } from '../../model/DexterModel';
import { Stack } from '@mui/material';
import { KeywordChip } from './KeywordChip';
import React from 'react';
import styled from '@emotion/styled';

export function KeywordList(props: {
  keywords: ResultKeyword[];
  sx?: any;
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
          <KeywordChip
            key={index}
            keyword={keyword}
            onDelete={() => props.onDelete && props.onDelete(keyword)}
          />
        ) : (
          <KeywordChip key={index} keyword={keyword} />
        ),
      )}
    </Stack>
  );
}
