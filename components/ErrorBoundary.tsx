
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  // Mark children as optional to satisfy compiler during JSX element creation
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component to catch rendering errors in the UI tree.
 */
// Fix: Extending Component with explicit props and state types to ensure inheritance is recognized by TypeScript
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly declare state and props to resolve "Property does not exist" errors on this instance
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Initializing state property
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Fix: Destructuring state and props from the instance which are now explicitly declared
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">System Error</h1>
            <p className="text-gray-500 mb-6">Something went wrong with the interface. The emergency backend is unaffected.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition w-full"
            >
              Reload Interface
            </button>
            <p className="mt-4 text-[10px] text-gray-400 font-mono overflow-hidden text-ellipsis uppercase">
              {error?.message}
            </p>
          </div>
        </div>
      );
    }

    // Returning children from the destructured props
    return children || null;
  }
}

export default ErrorBoundary;
