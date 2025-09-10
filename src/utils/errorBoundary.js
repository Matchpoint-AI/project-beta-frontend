var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { Component } from 'react';
/**
 * Error Boundary component to catch JavaScript errors in child components
 * and prevent the entire app from crashing due to external script errors
 */
var ErrorBoundary = /** @class */ (function (_super) {
  __extends(ErrorBoundary, _super);
  function ErrorBoundary(props) {
    var _this = _super.call(this, props) || this;
    _this.state = { hasError: false };
    return _this;
  }
  ErrorBoundary.getDerivedStateFromError = function (error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error: error };
  };
  ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
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
    this.setState({ hasError: true, error: error });
  };
  ErrorBoundary.prototype.render = function () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback ||
        _jsxs('div', {
          className: 'error-boundary-fallback',
          children: [
            _jsx('h2', { children: 'Something went wrong.' }),
            _jsx('details', {
              style: { whiteSpace: 'pre-wrap' },
              children: this.state.error && this.state.error.toString(),
            }),
          ],
        })
      );
    }
    return this.props.children;
  };
  return ErrorBoundary;
})(Component);
export { ErrorBoundary };
/**
 * Hook to handle external script errors gracefully
 */
export var useExternalScriptErrorHandler = function () {
  React.useEffect(function () {
    var handleGlobalError = function (event) {
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
    return function () {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);
};
/**
 * Utility function to safely add event listeners with null checks
 */
export var safeAddEventListener = function (element, event, handler, options) {
  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener(event, handler, options);
  } else {
    console.warn('Cannot add event listener to element:', element);
  }
};
/**
 * Utility function to safely remove event listeners
 */
export var safeRemoveEventListener = function (element, event, handler, options) {
  if (element && typeof element.removeEventListener === 'function') {
    element.removeEventListener(event, handler, options);
  }
};
/**
 * Utility function to safely access DOM elements
 */
export var safeGetElementById = function (id) {
  try {
    return document.getElementById(id);
  } catch (error) {
    console.warn('Error accessing element with id "'.concat(id, '":'), error);
    return null;
  }
};
/**
 * Utility function to safely map over arrays with null checks
 */
export var safeMap = function (array, mapper, fallback) {
  if (fallback === void 0) {
    fallback = [];
  }
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
//# sourceMappingURL=errorBoundary.js.map
