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
  ErrorBoundary.getDerivedStateFromError = function (_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error: _error };
  };
  ErrorBoundary.prototype.componentDidCatch = function (_error, _errorInfo) {
    // Log error to console for debugging
    // Check if it's the share-modal.js error and handle it gracefully
    if (_error.message.includes('share-modal') || _error.message.includes('addEventListener')) {
      // Don't set hasError for external script errors
      return;
    }
    // For other errors, set the error state
    this.setState({ hasError: true, error: _error });
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
        // Error logged for debugging purposes
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
    // Error handled silently
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
  } catch (_error) {
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
  } catch (_error) {
    return fallback;
  }
};
//# sourceMappingURL=errorBoundary.js.map
