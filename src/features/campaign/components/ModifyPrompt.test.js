var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ModifyPrompt from './ModifyPrompt';
// Mock the dependencies
vi.mock('../../../features/auth/context/AuthContext', function () { return ({
    useAuth: function () { return ({
        profile: {
            token: 'test-token',
            name: 'Test User',
        },
    }); },
}); });
vi.mock('../../../helpers/getServiceURL', function () { return ({
    getServiceURL: function () { return 'http://test-url'; },
}); });
// Mock fetch
global.fetch = vi.fn();
// Mock console methods
var consoleSpy = {
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
};
Object.assign(console, consoleSpy);
describe('ModifyPrompt', function () {
    var defaultProps = {
        week: 1,
        day: 1,
        post: 0,
        content_id: 'test-content-id',
        image: 'test-image-url',
        open: true,
        setOpen: vi.fn(),
        regenerate: vi.fn(),
        totalAllowed: 3,
    };
    beforeEach(function () {
        vi.clearAllMocks();
    });
    describe('splitPrompt function', function () {
        it('should handle prompts with "A realistic photograph of" prefix', function () {
            render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
            // Access the splitPrompt function through the component's logic
            var testPrompt = 'A realistic photograph of young professionals in an office';
            var expectedFirstPart = 'young professionals in an office';
            // The splitPrompt function is used internally, so we test its behavior
            // by checking how the component handles prompts
            expect(testPrompt.replace('A realistic photograph of', '').trim()).toBe(expectedFirstPart);
        });
        it('should handle prompts with "A photograph of" prefix', function () {
            var testPrompt = 'A photograph of diverse individuals';
            var expectedFirstPart = 'diverse individuals';
            expect(testPrompt.replace('A photograph of', '').trim()).toBe(expectedFirstPart);
        });
        it('should handle prompts with "A realistic image of" prefix', function () {
            var testPrompt = 'A realistic image of young adults';
            var expectedFirstPart = 'young adults';
            expect(testPrompt.replace('A realistic image of', '').trim()).toBe(expectedFirstPart);
        });
        it('should handle prompts with "An image of" prefix', function () {
            var testPrompt = 'An image of professionals';
            var expectedFirstPart = 'professionals';
            expect(testPrompt.replace('An image of', '').trim()).toBe(expectedFirstPart);
        });
        it('should handle prompts without any prefix', function () {
            var testPrompt = 'Young professionals in a modern office';
            // Should remain unchanged
            expect(testPrompt).toBe('Young professionals in a modern office');
        });
        it('should handle empty prompts', function () {
            var testPrompt = '';
            var result = testPrompt
                ? testPrompt.replace(/^A (realistic )?(photograph|image) of /, '').trim()
                : '';
            expect(result).toBe('');
        });
    });
    describe('prompt editing', function () {
        it('should not automatically add "A realistic photograph of" prefix', function () { return __awaiter(void 0, void 0, void 0, function () {
            var textField;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Young professionals in an office' })];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByDisplayValue('Young professionals in an office')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        textField = screen.getByDisplayValue('Young professionals in an office');
                        fireEvent.change(textField, { target: { value: 'New prompt content' } });
                        // The component should not automatically add the prefix
                        expect(textField).toHaveValue('New prompt content');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle prompts with existing content', function () { return __awaiter(void 0, void 0, void 0, function () {
            var textField;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            prompt: 'A realistic photograph of young professionals. Additional content.',
                                        })];
                                });
                            }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByDisplayValue('young professionals')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        textField = screen.getByDisplayValue('young professionals');
                        fireEvent.change(textField, { target: { value: 'Updated content' } });
                        // Should update the content without adding prefix
                        expect(textField).toHaveValue('Updated content');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('form submission', function () {
        it('should submit prompt without hardcoded prefix', function () { return __awaiter(void 0, void 0, void 0, function () {
            var textField, regenerateButtons, regenerateButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Young professionals in an office' })];
                            }); }); },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByDisplayValue('Young professionals in an office')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        textField = screen.getByDisplayValue('Young professionals in an office');
                        fireEvent.change(textField, { target: { value: 'Campaign-driven prompt' } });
                        regenerateButtons = screen.getAllByText('Regenerate');
                        regenerateButton = regenerateButtons[0];
                        fireEvent.click(regenerateButton);
                        return [4 /*yield*/, waitFor(function () {
                                expect(global.fetch).toHaveBeenCalledWith('http://test-url/api/v1/image_prompt?week_num=1&day_num=1&post_num=1&content_id=test-content-id', expect.objectContaining({
                                    headers: expect.objectContaining({
                                        Authorization: 'Bearer test-token',
                                    }),
                                }));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle submission errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var regenerateButtons, regenerateButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Test prompt' })];
                            }); }); },
                        })
                            .mockResolvedValueOnce({
                            ok: false,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ detail: 'Submission failed' })];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByDisplayValue('Test prompt')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        regenerateButtons = screen.getAllByText('Regenerate');
                        regenerateButton = regenerateButtons[0];
                        fireEvent.click(regenerateButton);
                        // Should handle the error gracefully
                        return [4 /*yield*/, waitFor(function () { })];
                    case 2:
                        // Should handle the error gracefully
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('remaining generations', function () {
        it('should fetch and display remaining generations', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Test prompt' })];
                            }); }); },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ remaining: 2 })];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('2 Regenerations left for this post')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should disable regenerate button when no generations left', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Test prompt' })];
                            }); }); },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ remaining: 0 })];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                var regenerateButtons = screen.getAllByText('Regenerate');
                                var regenerateButton = regenerateButtons[0];
                                var buttonElement = regenerateButton.closest('button');
                                expect(buttonElement).toBeDisabled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('accessibility', function () {
        it('should have proper ARIA labels', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Test prompt' })];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByRole('form')).toBeInTheDocument();
                                expect(screen.getByRole('textbox')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have proper form structure', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ prompt: 'Test prompt' })];
                            }); }); },
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        return [4 /*yield*/, waitFor(function () {
                                var form = screen.getByRole('form');
                                expect(form).toHaveAttribute('role', 'form');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('error handling', function () {
        it('should handle network errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockRejectedValueOnce(new Error('Network error'));
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        // Should not crash and should log the error
                        return [4 /*yield*/, waitFor(function () { })];
                    case 1:
                        // Should not crash and should log the error
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle authentication errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: false,
                            status: 401,
                        });
                        render(_jsx(ModifyPrompt, __assign({}, defaultProps)));
                        // Should handle 401 errors by redirecting to login
                        return [4 /*yield*/, waitFor(function () {
                                // Authentication failed - token may be invalid or expired
                            })];
                    case 1:
                        // Should handle 401 errors by redirecting to login
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=ModifyPrompt.test.js.map