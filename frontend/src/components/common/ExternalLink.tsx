import { SummaryP } from './ShortFieldsSummary';
import { blue, grey } from '@mui/material/colors';
import isUrl from '../../utils/isUrl';
import { truncateMiddle } from '../../utils/truncateMiddle';
import React from 'react';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import styled from '@emotion/styled';

const OpenInNewOutlinedIconStyled = styled(OpenInNewOutlinedIcon)`
  margin-left: 0.4em;
`;
const A = styled.a`
  color: ${blue[600]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export function ExternalLink(props: { fieldName: string; url: string }) {
  return (
    <SummaryP>
      <span style={{ color: grey[600] }}>{props.fieldName}: </span>
      {isUrl(props.url) ? (
        <>
          <A href={props.url} target="_blank" rel="noreferrer">
            {truncateMiddle(props.url, 100)}
          </A>
          <OpenInNewOutlinedIconStyled fontSize="inherit" />
        </>
      ) : (
        <>{props.url}</>
      )}
    </SummaryP>
  );
}
