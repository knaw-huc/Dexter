import React from 'react';
import styled from '@emotion/styled';

import { ErrorWithMessage } from './ErrorWithMessage';

export const ERROR_MESSAGE_CLASS = 'error-msg';

export const ErrorMsgStyled = styled.p`
  color: red;
  margin-top: 0.5em;
  margin-bottom: 0;
`;
export function FieldError(props: { error: ErrorWithMessage }) {
  if (!props.error) {
    return null;
  }
  return (
    <ErrorMsgStyled className={ERROR_MESSAGE_CLASS}>
      {props.error.message}
    </ErrorMsgStyled>
  );
}
