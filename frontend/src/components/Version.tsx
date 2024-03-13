import React from 'react';
import styled from '@emotion/styled';

// @ts-expect-error Injected by webpack, see webpack.config-*.js
const VERSION = __VERSION__;

const AStyled = styled.a`
  color: grey;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
export function Version() {
  return (
    <p
      style={{
        marginTop: '6em',
        textAlign: 'center',
        fontSize: '0.9em',
      }}
    >
      <AStyled
        style={{
          color: 'grey',
        }}
        href="https://github.com/knaw-huc/Dexter/blob/main/CHANGELOG.md"
      >
        Dexter {VERSION}
      </AStyled>
    </p>
  );
}
