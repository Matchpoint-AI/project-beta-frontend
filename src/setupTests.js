import '@testing-library/jest-dom';
import { vi } from 'vitest';
// Mock firebase-config for V2 API hook
vi.mock('./firebase-config', function () { return ({
    auth: {
        currentUser: {
            getIdToken: vi.fn().mockResolvedValue('test-token'),
        },
    },
}); });
// Global mock for scrapeProduct
try {
    // @ts-expect-error - vi is a global variable in vitest environment
    if (typeof vi !== 'undefined') {
        vi.mock('./helpers/scrapeProduct', function () { return ({
            default: vi.fn().mockResolvedValue({
                name: 'Test Product',
                description: 'Test Description',
                product_features: ['Feature 1', 'Feature 2'],
            }),
        }); });
    }
}
catch (e) {
    // Ignore if vi is not available
}
// Polyfill for crypto.getRandomValues
Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues: function (arr) {
            if (typeof globalThis !== 'undefined' && globalThis.require) {
                var crypto_1 = globalThis.require('crypto');
                if (crypto_1.randomFillSync) {
                    crypto_1.randomFillSync(arr);
                    return arr;
                }
            }
            // Fallback for environments without Node.js crypto
            for (var i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
        },
        randomUUID: function () {
            if (typeof globalThis !== 'undefined' && globalThis.require) {
                var crypto_2 = globalThis.require('crypto');
                if (crypto_2.randomUUID) {
                    return crypto_2.randomUUID();
                }
            }
            // Fallback UUID generation
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0;
                var v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        },
    },
    configurable: true,
});
// Additional browser API mocks
if (typeof window !== 'undefined') {
    // Mock ResizeObserver
    window.ResizeObserver =
        window.ResizeObserver || /** @class */ (function () {
            function ResizeObserver() {
            }
            ResizeObserver.prototype.observe = function () { };
            ResizeObserver.prototype.unobserve = function () { };
            ResizeObserver.prototype.disconnect = function () { };
            return ResizeObserver;
        }());
    // Mock IntersectionObserver
    window.IntersectionObserver =
        window.IntersectionObserver || /** @class */ (function () {
            function IntersectionObserver() {
            }
            IntersectionObserver.prototype.observe = function () { };
            IntersectionObserver.prototype.unobserve = function () { };
            IntersectionObserver.prototype.disconnect = function () { };
            return IntersectionObserver;
        }());
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: function (query) { return ({
            matches: false,
            media: query,
            onchange: null,
            addListener: function () { },
            removeListener: function () { },
            addEventListener: function () { },
            removeEventListener: function () { },
            dispatchEvent: function () { },
        }); },
    });
}
//# sourceMappingURL=setupTests.js.map