import React, { Component, PropsWithChildren } from 'react';
import { Alert } from '@mui/material';

export type ErrorWithMessage = {
  message: string;
};

type ErrorBoundaryProps = PropsWithChildren & {
  error: Error;
};

type ErrorBoundaryState = {
  error: Error;
};

/**
 * Error boundary displaying:
 * - error thrown/caught in children of ErrorBoundary
 * - or error present in props\.error
 */
export default class ErrorHandler extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: props.error,
    };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    const error = this.state.error || this.props.error;
    if (!error) {
      return this.props.children;
    }
    return (
      <div style={{ margin: '1em' }}>
        <Alert severity="error">
          Er trad een fout op: <code>{error.message}</code>
        </Alert>
      </div>
    );
  }
}
