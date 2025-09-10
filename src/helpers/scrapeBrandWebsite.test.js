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
import { describe, it, expect, vi } from 'vitest';
import scrapeBrandWebsite from './scrapeBrandWebsite';
// Mock getServiceURL to avoid actual network calls
vi.mock('./getServiceURL', function () {
  return {
    getServiceURL: function () {
      return 'http://mock-llm';
    },
  };
});
// Mock convertToChipsArray to return the input array
vi.mock('./convertToChips', function () {
  return {
    default: function (arr) {
      return arr;
    },
  };
});
global.fetch = vi.fn();
describe('scrapeBrandWebsite', function () {
  var baseBusinessInfo = { website: 'https://example.com' };
  var setBusinessInfo = vi.fn();
  afterEach(function () {
    vi.clearAllMocks();
  });
  it('should set brandColors to [] if colors is undefined', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var updateFunction, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fetch.mockResolvedValueOnce({
              json: function () {
                return __awaiter(void 0, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      {
                        Brand_mission: 'm',
                        Brand_vision: 'v',
                        Brand_values: ['v1'],
                        Brand_tone_and_voice: ['t1'],
                        Brand_persona: ['p1'],
                        Brand_style: 's',
                        Brand_products: 'p',
                        Industry: 'i',
                        Industry_Vertical: 'iv',
                        Suggested_locations_for_photography: 'l',
                        themes: 'th',
                        scenes: 'sc',
                        negative_prompts: 'np',
                        colors: undefined,
                      },
                    ];
                  });
                });
              },
              ok: true,
            });
            return [4 /*yield*/, scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo)];
          case 1:
            _a.sent();
            // Check that setBusinessInfo was called with a function
            expect(setBusinessInfo).toHaveBeenCalledWith(expect.any(Function));
            updateFunction = setBusinessInfo.mock.calls[0][0];
            result = updateFunction(baseBusinessInfo);
            expect(result.brandColors).toEqual([]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should set brandColors to [] if colors is null', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var updateFunction, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fetch.mockResolvedValueOnce({
              json: function () {
                return __awaiter(void 0, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      {
                        Brand_mission: 'm',
                        Brand_vision: 'v',
                        Brand_values: ['v1'],
                        Brand_tone_and_voice: ['t1'],
                        Brand_persona: ['p1'],
                        Brand_style: 's',
                        Brand_products: 'p',
                        Industry: 'i',
                        Industry_Vertical: 'iv',
                        Suggested_locations_for_photography: 'l',
                        themes: 'th',
                        scenes: 'sc',
                        negative_prompts: 'np',
                        colors: null,
                      },
                    ];
                  });
                });
              },
              ok: true,
            });
            return [4 /*yield*/, scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo)];
          case 1:
            _a.sent();
            updateFunction = setBusinessInfo.mock.calls[0][0];
            result = updateFunction(baseBusinessInfo);
            expect(result.brandColors).toEqual([]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should set brandColors to [] if colors is missing', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var updateFunction, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fetch.mockResolvedValueOnce({
              json: function () {
                return __awaiter(void 0, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      {
                        Brand_mission: 'm',
                        Brand_vision: 'v',
                        Brand_values: ['v1'],
                        Brand_tone_and_voice: ['t1'],
                        Brand_persona: ['p1'],
                        Brand_style: 's',
                        Brand_products: 'p',
                        Industry: 'i',
                        Industry_Vertical: 'iv',
                        Suggested_locations_for_photography: 'l',
                        themes: 'th',
                        scenes: 'sc',
                        negative_prompts: 'np',
                        // colors property is missing entirely
                      },
                    ];
                  });
                });
              },
              ok: true,
            });
            return [4 /*yield*/, scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo)];
          case 1:
            _a.sent();
            updateFunction = setBusinessInfo.mock.calls[0][0];
            result = updateFunction(baseBusinessInfo);
            expect(result.brandColors).toEqual([]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should set brandColors to first three colors if present', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var updateFunction, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fetch.mockResolvedValueOnce({
              json: function () {
                return __awaiter(void 0, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      {
                        Brand_mission: 'm',
                        Brand_vision: 'v',
                        Brand_values: ['v1'],
                        Brand_tone_and_voice: ['t1'],
                        Brand_persona: ['p1'],
                        Brand_style: 's',
                        Brand_products: 'p',
                        Industry: 'i',
                        Industry_Vertical: 'iv',
                        Suggested_locations_for_photography: 'l',
                        themes: 'th',
                        scenes: 'sc',
                        negative_prompts: 'np',
                        colors: ['#fff', '#000', '#ccc', '#ddd'],
                      },
                    ];
                  });
                });
              },
              ok: true,
            });
            return [4 /*yield*/, scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo)];
          case 1:
            _a.sent();
            updateFunction = setBusinessInfo.mock.calls[0][0];
            result = updateFunction(baseBusinessInfo);
            expect(result.brandColors).toEqual(['#fff', '#000', '#ccc']);
            return [2 /*return*/];
        }
      });
    });
  });
});
//# sourceMappingURL=scrapeBrandWebsite.test.js.map
