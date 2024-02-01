import { Alert } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';

export type ErrorBoundaryProps = any;
export type ErrorBoundaryState = {
  error?: Error;
};

const AlertStyled = styled(Alert)`
  margin-bottom: 0.5em;
`;
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    return (
      <>
        {this.state.error && (
          <AlertStyled severity="error">{this.state.error.message}</AlertStyled>
        )}

        {this.props.children}
      </>
    );
  }
}
