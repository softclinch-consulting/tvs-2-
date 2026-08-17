import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log to an error reporting service here
    // eslint-disable-next-line no-console
    console.error('Captured error in ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || 'Unknown error';
      const stack = this.state.errorInfo?.componentStack || '';
      return (
        <div style={{ padding: 24, color: '#fff', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#ff6b6b' }}>Application error</h2>
          <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
          <details style={{ marginTop: 12, color: '#ddd' }}>
            <summary>Stack</summary>
            <pre style={{ color: '#ddd' }}>{stack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
