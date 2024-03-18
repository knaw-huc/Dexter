import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { ErrorAlert } from './ErrorAlert';
import { toMessage } from './toMessage';

type ErrorBoundaryProps = PropsWithChildren;

type ErrorBoundaryState = {
  error?: Error;
  isShown: boolean;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, isShown: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary >', error, errorInfo);
    this.setState({ error, isShown: true });
  }

  render() {
    const error = this.state.error;
    if (!error) {
      return this.props.children;
    }
    if (!this.state.isShown) {
      return null;
    }
    return (
      <div style={{ margin: '1em' }}>
        <ErrorBoundaryAlert
          error={error}
          onClose={() => this.setState({ isShown: false })}
        />
      </div>
    );
  }
}

export type ClosableErrorAlertProps = {
  error: Error;
  onClose: () => void;
};

export function ErrorBoundaryAlert(props: ClosableErrorAlertProps) {
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
