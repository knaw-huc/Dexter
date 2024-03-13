import { SummaryP } from './ShortFieldsSummary';
import { blue, grey } from '@mui/material/colors';
import isUrl from '../../utils/isUrl';
import { truncateMiddle } from '../../utils/truncateMiddle';
import React from 'react';
import styled from '@emotion/styled';
import { ExternalIconStyled } from './ExternalIconStyled';

const A = styled.a`
  color: ${blue[600]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export function ExternalLink(props: {
  fieldName: string;
  url: string;
  fieldLabel?: string;
}) {
  return (
    <SummaryP>
      <span style={{ color: grey[600] }}>
        {props.fieldLabel || props.fieldName}:{' '}
      </span>
      {isUrl(props.url) ? (
        <>
          <A href={props.url} target="_blank" rel="noreferrer">
            {truncateMiddle(props.url, 100)}
          </A>
          <ExternalIconStyled />
        </>
      ) : (
        <>{props.url}</>
      )}
    </SummaryP>
  );
}
