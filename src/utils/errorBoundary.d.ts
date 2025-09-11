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
export declare class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props);
  static getDerivedStateFromError(_error: Error): State;
  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void;
  render():
    | string
    | number
    | boolean
    | Iterable<React.ReactNode>
    | import('react/jsx-runtime').JSX.Element
    | null
    | undefined;
}
/**
 * Hook to handle external script errors gracefully
 */
export declare const useExternalScriptErrorHandler: () => void;
/**
 * Utility function to safely add event listeners with null checks
 */
export declare const safeAddEventListener: (
  element: HTMLElement | null,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
) => void;
/**
 * Utility function to safely remove event listeners
 */
export declare const safeRemoveEventListener: (
  element: HTMLElement | null,
  event: string,
  handler: EventListener,
  options?: boolean | EventListenerOptions
) => void;
/**
 * Utility function to safely access DOM elements
 */
export declare const safeGetElementById: (id: string) => HTMLElement | null;
/**
 * Utility function to safely map over arrays with null checks
 */
export declare const safeMap: <T, R>(
  array: T[] | null | undefined,
  mapper: (item: T, index: number) => R,
  fallback?: R[]
) => R[];
export {};
