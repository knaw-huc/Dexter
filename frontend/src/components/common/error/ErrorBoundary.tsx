import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { isResponseError } from '../isResponseError';
import { ErrorAlert } from './ErrorAlert';

type ErrorBoundaryProps = PropsWithChildren;

type ErrorBoundaryState = {
  error?: Error;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorHandler >', error, errorInfo);
    this.setState({ error });
  }

  render() {
    const error = this.state.error;
    if (!error) {
      return this.props.children;
    }
    return (
      <div style={{ margin: '1em' }}>
        <ErrorBoundaryAlert
          error={error}
          onClose={() => this.setState({ error: null })}
        />

        {this.props.children}
      </div>
    );
  }
}

export type ClosableErrorAlertProps = {
  error: Error;
  onClose: () => void;
};

export function ErrorBoundaryAlert(props: ClosableErrorAlertProps) {
  function toMessage(error: Error) {
    if (!error) {
      return '';
    } else if (isResponseError(error)) {
      const body = error.json;
      return body.message;
    } else {
      return error.message;
    }
  }

  function handleClose() {
    props.onClose();
  }

  if (!props.error) {
    return null;
  }

  return (
    <ErrorAlert
      message={toMessage(props.error)}
      onClose={handleClose}
      sx={{ marginBottom: '1em' }}
    />
  );
}
