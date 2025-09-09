import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and prevent the entire app from crashing due to external script errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Check if it's the share-modal.js error and handle it gracefully
    if (error.message.includes('share-modal') || error.message.includes('addEventListener')) {
      console.warn('External script error detected (likely share-modal.js), continuing gracefully');
      // Don't set hasError for external script errors
      return;
    }

    // For other errors, set the error state
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="error-boundary-fallback">
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
            </details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to handle external script errors gracefully
 */
export const useExternalScriptErrorHandler = () => {
  React.useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Check if it's the share-modal.js error or similar external script errors
      if (
        event.filename &&
        (event.filename.includes('share-modal.js') ||
          event.filename.includes('addEventListener') ||
          event.message.includes('Cannot read properties of null'))
      ) {
        console.warn('External script error detected, handling gracefully:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });

        // Prevent the error from being logged to console
        event.preventDefault();
        return false;
      }
    };

    // Add global error handler
    window.addEventListener('error', handleGlobalError);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);
};

/**
 * Utility function to safely add event listeners with null checks
 */
export const safeAddEventListener = (
  element: HTMLElement | null,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
) => {
  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener(event, handler, options);
  } else {
    console.warn(`Cannot add event listener to element:`, element);
  }
};

/**
 * Utility function to safely remove event listeners
 */
export const safeRemoveEventListener = (
  element: HTMLElement | null,
  event: string,
  handler: EventListener,
  options?: boolean | EventListenerOptions
) => {
  if (element && typeof element.removeEventListener === 'function') {
    element.removeEventListener(event, handler, options);
  }
};

/**
 * Utility function to safely access DOM elements
 */
export const safeGetElementById = (id: string): HTMLElement | null => {
  try {
    return document.getElementById(id);
  } catch (error) {
    console.warn(`Error accessing element with id "${id}":`, error);
    return null;
  }
};

/**
 * Utility function to safely map over arrays with null checks
 */
export const safeMap = <T, R>(
  array: T[] | null | undefined,
  mapper: (item: T, index: number) => R,
  fallback: R[] = []
): R[] => {
  if (!array || !Array.isArray(array)) {
    return fallback;
  }

  try {
    return array.map(mapper);
  } catch (error) {
    console.warn('Error mapping over array:', error);
    return fallback;
  }
};
