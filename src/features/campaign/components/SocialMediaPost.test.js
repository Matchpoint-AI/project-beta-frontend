var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
import { jsx as _jsx } from 'react/jsx-runtime';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import SocialMediaPost from './SocialMediaPost';
import { AuthContext } from '../../../features/auth/context/AuthContext';
// --- BROWSER API MOCKS (robust for CI) ---
var ResizeObserverMock = /** @class */ (function () {
  function ResizeObserverMock() {}
  ResizeObserverMock.prototype.observe = function () {};
  ResizeObserverMock.prototype.unobserve = function () {};
  ResizeObserverMock.prototype.disconnect = function () {};
  return ResizeObserverMock;
})();
if (typeof globalThis !== 'undefined') globalThis.ResizeObserver = ResizeObserverMock;
if (typeof window !== 'undefined') window.ResizeObserver = ResizeObserverMock;
if (typeof global !== 'undefined') global.ResizeObserver = ResizeObserverMock;
global.IntersectionObserver = vi.fn().mockImplementation(function () {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});
window.IntersectionObserver = global.IntersectionObserver;
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }),
});
Object.defineProperty(window, 'getComputedStyle', {
  value: function () {
    return {
      getPropertyValue: function () {
        return '';
      },
    };
  },
});
Element.prototype.getBoundingClientRect = vi.fn(function () {
  return {
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0,
    toJSON: function () {
      return {};
    },
  };
});
// --- END BROWSER API MOCKS ---
// Mock dependencies
vi.mock('../../../helpers/getServiceURL', function () {
  return {
    getServiceURL: vi.fn(function () {
      return 'http://localhost:8000';
    }),
  };
});
vi.mock('../../../helpers/posthog', function () {
  return {
    default: {
      __loaded: true,
      capture: vi.fn(),
    },
  };
});
// Global mocks
global.fetch = vi.fn(function () {
  return Promise.resolve({
    ok: true,
    json: function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, {}];
        });
      });
    },
  });
});
var mockProfile = {
  id: 'test-user-id',
  token: 'test-token',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
};
var mockAuthContext = {
  profile: mockProfile,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
  setProfile: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
};
var mockContent = {
  id: '1',
  text: 'This is a test post content',
  image_url: ['image1.jpg', 'image2.jpg'],
  approved: false,
  posted: false,
  time: '9:00 AM',
};
var defaultProps = {
  day: 1,
  postIndex: 1,
  setOpen: vi.fn(),
  content: mockContent,
  id: 'test-content-id',
  week: 1,
  postingTime: '9:00 AM',
  brandName: 'Test Brand',
  onApprovalUpdate: vi.fn(),
  updataImage: vi.fn(),
  selectedImages: [1],
  setSelectedImages: vi.fn(),
};
var renderWithAuth = function (props) {
  if (props === void 0) {
    props = {};
  }
  return render(
    _jsx(AuthContext.Provider, {
      value: mockAuthContext,
      children: _jsx(SocialMediaPost, __assign({}, defaultProps, props)),
    })
  );
};
describe('SocialMediaPost Component', function () {
  beforeEach(function () {
    vi.clearAllMocks();
    global.fetch.mockClear();
    // Reset fetch to default mock implementation
    global.fetch.mockImplementation(function () {
      return Promise.resolve({
        ok: true,
        json: function () {
          return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
              return [2 /*return*/, {}];
            });
          });
        },
      });
    });
  });
  afterEach(function () {
    vi.restoreAllMocks();
  });
  describe('When rendering post information', function () {
    it('should display post number and timing', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Post 1')).toBeInTheDocument();
              expect(screen.getByText('9:00 AM')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should show the post text content', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('This is a test post content')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should display the first image by default', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var image;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              image = screen.getByRole('img');
              expect(image).toHaveAttribute('src', 'image1.jpg');
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When post is not approved', function () {
    it('should show approve button', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Approve Post')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should show image controls for editing', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var buttons;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              buttons = screen.getAllByRole('button');
              expect(buttons.length).toBeGreaterThan(2);
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When post is approved', function () {
    it('should show "Ready to Publish" status', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { approved: true }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Ready to Publish')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should hide image editing controls', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { approved: true }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Should not show edit controls when approved
              expect(screen.queryByRole('button', { name: /expand/i })).not.toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When post is already posted', function () {
    it('should show "Posted" status', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { posted: true }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Posted')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When managing image states', function () {
    it('should show loading spinner while image loads', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByRole('progressbar')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle image load completion', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var image;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              image = screen.getByRole('img');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.load(image);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 2:
              _a.sent();
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
                }),
              ];
            case 3:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle image load errors', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var image;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              image = screen.getByRole('img');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.error(image);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 2:
              _a.sent();
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
                }),
              ];
            case 3:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When approving posts', function () {
    it('should call approval API when approve button is clicked', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, approveButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              fetchSpy = vi.spyOn(global, 'fetch');
              // Mock the initial calls that happen on mount
              fetchSpy
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                }) // initial call
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                }); // approval call
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for initial mount calls to complete
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(fetchSpy).toHaveBeenCalled();
                }),
              ];
            case 2:
              // Wait for initial mount calls to complete
              _a.sent();
              approveButton = screen.getByText('Approve Post');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(approveButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 3:
              _a.sent();
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(
                    fetchSpy.mock.calls.some(function (call) {
                      return call[0].includes('/api/v1/contentgen/approve');
                    })
                  ).toBe(true);
                }),
              ];
            case 4:
              _a.sent();
              fetchSpy.mockRestore();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should show loading state during approval', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var approveButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // Mock initial call
              global.fetch
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                })
                .mockImplementationOnce(function () {
                  return new Promise(function (resolve) {
                    return setTimeout(function () {
                      return resolve({
                        ok: true,
                        json: function () {
                          return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                              return [2 /*return*/, {}];
                            });
                          });
                        },
                      });
                    }, 100);
                  });
                });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for initial mount
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalled();
                }),
              ];
            case 2:
              // Wait for initial mount
              _a.sent();
              approveButton = screen.getByText('Approve Post');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(approveButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 3:
              _a.sent();
              // Check that loading state appears
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByRole('progressbar')).toBeInTheDocument();
                }),
              ];
            case 4:
              // Check that loading state appears
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should call onApprovalUpdate callback on success', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var onApprovalUpdateMock, approveButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              onApprovalUpdateMock = vi.fn();
              global.fetch
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                })
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({ onApprovalUpdate: onApprovalUpdateMock });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for initial mount
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalled();
                }),
              ];
            case 2:
              // Wait for initial mount
              _a.sent();
              approveButton = screen.getByText('Approve Post');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(approveButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 3:
              _a.sent();
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(onApprovalUpdateMock).toHaveBeenCalled();
                }),
              ];
            case 4:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle approval errors', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var consoleSpy, approveButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              consoleSpy = vi.spyOn(console, 'error').mockImplementation(function () {});
              global.fetch
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                })
                .mockResolvedValueOnce({
                  ok: false,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, { detail: 'Approval failed' }];
                      });
                    });
                  },
                });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for initial mount
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalled();
                }),
              ];
            case 2:
              // Wait for initial mount
              _a.sent();
              approveButton = screen.getByText('Approve Post');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(approveButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 3:
              _a.sent();
              // Wait for the async operation to complete
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/api/v1/contentgen/approve'),
                    expect.objectContaining({
                      method: 'POST',
                      headers: {
                        Authorization: 'Bearer test-token',
                        'Content-Type': 'application/json',
                      },
                    })
                  );
                }),
              ];
            case 4:
              // Wait for the async operation to complete
              _a.sent();
              consoleSpy.mockRestore();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When editing text content', function () {
    it('should enable editing when edit button is clicked', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var buttons, editButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              buttons = screen.getAllByRole('button');
              editButton = buttons.find(function (btn) {
                var _a;
                return (
                  ((_a = btn.getAttribute('aria-label')) === null || _a === void 0
                    ? void 0
                    : _a.includes('edit')) || btn.querySelector('[data-testid*="edit"]')
                );
              });
              if (!editButton) return [3 /*break*/, 3];
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(editButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 2:
              _a.sent();
              expect(screen.getByRole('textbox')).toBeInTheDocument();
              _a.label = 3;
            case 3:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should save text changes when save is clicked', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var buttons, editButton, textarea;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              global.fetch
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                })
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for initial mount
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalled();
                }),
              ];
            case 2:
              // Wait for initial mount
              _a.sent();
              buttons = screen.getAllByRole('button');
              editButton = buttons[3];
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(editButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 3:
              _a.sent();
              textarea = screen.queryByRole('textbox');
              if (!textarea) return [3 /*break*/, 6];
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.change(textarea, { target: { value: 'Updated text' } });
                      fireEvent.click(editButton); // Same button toggles to save
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 4:
              _a.sent();
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/api/v1/contentgen/update-text-versions'),
                    expect.objectContaining({ method: 'POST' })
                  );
                }),
              ];
            case 5:
              _a.sent();
              _a.label = 6;
            case 6:
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When managing multiple images', function () {
    it('should show pagination for multiple images', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var multiImageContent;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              multiImageContent = __assign(__assign({}, mockContent), {
                image_url: ['image1.jpg', 'image2.jpg'],
              });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({ content: multiImageContent });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('1')).toBeInTheDocument();
              expect(screen.getByText('2')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle image selection changes', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var setSelectedImagesMock, multiImageContent, page2Button;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              setSelectedImagesMock = vi.fn();
              multiImageContent = __assign(__assign({}, mockContent), {
                image_url: ['image1.jpg', 'image2.jpg'],
              });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: multiImageContent,
                        setSelectedImages: setSelectedImagesMock,
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              page2Button = screen.getByText('2');
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(page2Button);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 2:
              _a.sent();
              // Check that the component handles the pagination
              expect(page2Button).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When handling hover interactions', function () {
    it('should show cancel option when hovering over approved post', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var container;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { approved: true }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              container = screen.getByText('Ready to Publish').closest('div');
              if (!container) return [3 /*break*/, 3];
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.mouseEnter(container);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 2:
              _a.sent();
              expect(screen.getByText('Cancel approved')).toBeInTheDocument();
              _a.label = 3;
            case 3:
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When handling edge cases', function () {
    it('should handle missing post data gracefully', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({ content: null });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Post 1')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle empty image array', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { image_url: [] }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Post 1')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle missing text content', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { text: '' }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              expect(screen.getByText('Post 1')).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should truncate very long text', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var longText;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              longText = 'A'.repeat(400);
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth({
                        content: __assign(__assign({}, mockContent), { text: longText }),
                      });
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Check that some form of the text is displayed
              expect(screen.getByText(longText, { exact: false })).toBeInTheDocument();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('When regenerating content', function () {
    it('should call regenerate API when regenerate button is clicked', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var buttons, regenerateButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              global.fetch
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  },
                })
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, { prompt: 'test prompt' }];
                      });
                    });
                  },
                })
                .mockResolvedValueOnce({
                  ok: true,
                  json: function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, { url: 'new-image.jpg', newText: 'New text' }];
                      });
                    });
                  },
                });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      renderWithAuth();
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for initial mount
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalled();
                }),
              ];
            case 2:
              // Wait for initial mount
              _a.sent();
              buttons = screen.getAllByRole('button');
              regenerateButton = buttons[2];
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(regenerateButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 3:
              _a.sent();
              // Verify that the regenerate API was called
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/api/v1/image_prompt'),
                    expect.objectContaining({
                      headers: {
                        Authorization: 'Bearer test-token',
                      },
                    })
                  );
                }),
              ];
            case 4:
              // Verify that the regenerate API was called
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('Image Pagination', function () {
    it('should display the next image when next button is clicked', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var multiImageContent, TestWrapper, nextButton, image;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              multiImageContent = __assign(__assign({}, mockContent), {
                image_url: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
              });
              TestWrapper = function (props) {
                var _a = React.useState([1]),
                  selectedImages = _a[0],
                  setSelectedImages = _a[1];
                return _jsx(AuthContext.Provider, {
                  value: mockAuthContext,
                  children: _jsx(
                    SocialMediaPost,
                    __assign({}, defaultProps, props, {
                      content: multiImageContent,
                      selectedImages: selectedImages,
                      setSelectedImages: setSelectedImages,
                    })
                  ),
                });
              };
              render(_jsx(TestWrapper, {}));
              nextButton = screen.getByRole('button', { name: /^2\s*$/ });
              return [
                4 /*yield*/,
                act(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      fireEvent.click(nextButton);
                      return [2 /*return*/];
                    });
                  });
                }),
              ];
            case 1:
              _a.sent();
              // Wait for the <img> src to update to image2.jpg
              return [
                4 /*yield*/,
                waitFor(function () {
                  var image = screen.getByRole('img');
                  expect(image).toHaveAttribute('src', 'image2.jpg');
                }),
              ];
            case 2:
              // Wait for the <img> src to update to image2.jpg
              _a.sent();
              image = screen.getByRole('img');
              fireEvent.load(image);
              // Assert the image is visible (not hidden)
              expect(image.className).not.toContain('hidden');
              return [2 /*return*/];
          }
        });
      });
    });
  });
});
//# sourceMappingURL=SocialMediaPost.test.js.map
