import React from 'react';
import { ExternalIconStyled } from './common/ExternalIconStyled';
import styled from '@emotion/styled';

// @ts-expect-error Injected by webpack, see webpack.config-*.js
const VERSION = __VERSION__;

const AStyled = styled.a`
  color: grey;
  text-decoration: none;
  &:hover {
    color: black;
  }
`;
export function Version() {
  return (
    <AStyled href="https://github.com/knaw-huc/Dexter/blob/main/CHANGELOG.md">
      Dexter version {VERSION}
      <ExternalIconStyled />
    </AStyled>
  );
}
