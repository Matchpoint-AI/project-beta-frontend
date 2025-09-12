import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, safeMap, safeGetElementById } from './errorBoundary';
describe('ErrorBoundary', function () {
    var ThrowError = function (_a) {
        var shouldThrow = _a.shouldThrow;
        if (shouldThrow) {
            throw new Error('Test error');
        }
        return _jsx("div", { children: "No error" });
    };
    it('renders children when there is no error', function () {
        render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: false }) }));
        expect(screen.getByText('No error')).toBeInTheDocument();
    });
    it('renders fallback UI when there is an error', function () {
        render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
});
describe('safeMap', function () {
    it('maps over valid array', function () {
        var array = [1, 2, 3];
        var result = safeMap(array, function (item) { return item * 2; });
        expect(result).toEqual([2, 4, 6]);
    });
    it('returns fallback for null array', function () {
        var result = safeMap(null, function (item) { return item * 2; }, [0]);
        expect(result).toEqual([0]);
    });
});
describe('safeGetElementById', function () {
    it('returns null when element does not exist', function () {
        var element = safeGetElementById('non-existent');
        expect(element).toBeNull();
    });
});
//# sourceMappingURL=errorBoundary.test.js.map