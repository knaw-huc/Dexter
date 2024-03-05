import React, {
  Component,
  ErrorInfo,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { isResponseError } from './common/isResponseError';
import { ErrorAlert } from './common/ErrorAlert';

export type ErrorWithMessage = {
  message: string;
};

type ErrorBoundaryProps = PropsWithChildren & {
  error: Error;
};

type ErrorBoundaryState = {
  error?: Error;
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
    this.state = { error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorHandler >', error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return (
      <div style={{ margin: '1em' }}>
        <ErrorHandlerAlert
          error={this.state.error}
          deleteError={() => this.setState({ error: null })}
        />

        {this.props.children}
      </div>
    );
  }
}
export type ErrorHandlerAlertProps = {
  error: Error;
  deleteError: () => void;
};

export function ErrorHandlerAlert(props: ErrorHandlerAlertProps) {
  const [message, setMessage] = useState('');

  const error = props.error;

  useEffect(() => {
    handleError();

    async function handleError() {
      if (!error) {
        setMessage('');
      } else if (isResponseError(error)) {
        const body = await error.response.json();
        setMessage(body.message);
      } else {
        setMessage(error.message);
      }
    }
  }, [error]);

  if (!message) {
    return null;
  }
  return (
    <ErrorAlert
      message={message}
      onClose={() => setMessage('')}
      sx={{ marginBottom: '1em' }}
    />
  );
}
