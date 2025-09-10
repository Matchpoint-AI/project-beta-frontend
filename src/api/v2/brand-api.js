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
/**
 * Brand API V2 Service
 *
 * Implements brand-related operations using protobuf messages.
 * All payloads are constructed using protobuf.js as per requirements.
 */
import { ProtoService } from './proto-service';
/**
 * Brand API V2 Service
 */
var BrandApiV2 = /** @class */ (function (_super) {
  __extends(BrandApiV2, _super);
  function BrandApiV2() {
    return (
      _super.call(this, {
        serviceName: 'Brand V2 API',
        baseUrl: '/api/v2',
      }) || this
    );
  }
  /**
   * Create a new brand
   */
  BrandApiV2.prototype.createBrand = function (data, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.post(
            '/brands',
            data,
            { package: 'protos', message: 'Brand' },
            { package: 'protos', message: 'Brand' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Get brand by ID
   */
  BrandApiV2.prototype.getBrand = function (brandId, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.get(
            '/brands/'.concat(brandId),
            { package: 'protos', message: 'Brand' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Update brand information
   */
  BrandApiV2.prototype.updateBrand = function (brandId, data, token) {
    return __awaiter(this, void 0, void 0, function () {
      var request;
      return __generator(this, function (_a) {
        request = __assign({ brand_id: brandId }, data);
        return [
          2 /*return*/,
          this.put(
            '/brands/'.concat(brandId),
            request,
            { package: 'protos', message: 'Brand' },
            { package: 'protos', message: 'Brand' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Delete a brand
   */
  BrandApiV2.prototype.deleteBrand = function (brandId, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.delete(
            '/brands/'.concat(brandId),
            { package: 'protos', message: 'Empty' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Get all brands for the user
   */
  BrandApiV2.prototype.getUserBrands = function (token, filters) {
    return __awaiter(this, void 0, void 0, function () {
      var queryParams, endpoint;
      return __generator(this, function (_a) {
        queryParams = new URLSearchParams();
        if (filters) {
          if (filters.industry) queryParams.append('industry', filters.industry);
          if (filters.limit) queryParams.append('limit', filters.limit.toString());
          if (filters.offset) queryParams.append('offset', filters.offset.toString());
        }
        endpoint = '/brands'.concat(
          queryParams.toString() ? '?'.concat(queryParams.toString()) : ''
        );
        return [
          2 /*return*/,
          this.get(endpoint, { package: 'protos', message: 'Brand' }, { token: token }),
        ];
      });
    });
  };
  /**
   * Create brand knowledge
   */
  BrandApiV2.prototype.createBrandKnowledge = function (data, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.post(
            '/brands/'.concat(data.brand_id, '/knowledge'),
            data,
            { package: 'protos', message: 'BrandKnowledge' },
            { package: 'protos', message: 'BrandKnowledge' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Get brand knowledge
   */
  BrandApiV2.prototype.getBrandKnowledge = function (brandId, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.get(
            '/brands/'.concat(brandId, '/knowledge'),
            { package: 'protos', message: 'BrandKnowledge' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Update brand knowledge
   */
  BrandApiV2.prototype.updateBrandKnowledge = function (brandId, knowledgeId, data, token) {
    return __awaiter(this, void 0, void 0, function () {
      var request;
      return __generator(this, function (_a) {
        request = __assign({ brand_id: brandId, knowledge_id: knowledgeId }, data);
        return [
          2 /*return*/,
          this.put(
            '/brands/'.concat(brandId, '/knowledge/').concat(knowledgeId),
            request,
            { package: 'protos', message: 'BrandKnowledge' },
            { package: 'protos', message: 'BrandKnowledge' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Crawl website for brand information
   */
  BrandApiV2.prototype.crawlWebsite = function (data, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.post(
            '/brands/'.concat(data.brand_id, '/crawl'),
            data,
            { package: 'protos', message: 'CrawlRequest' },
            { package: 'protos', message: 'CrawlJob' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Get crawl job status
   */
  BrandApiV2.prototype.getCrawlStatus = function (brandId, jobId, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.get(
            '/brands/'.concat(brandId, '/crawl/').concat(jobId),
            { package: 'protos', message: 'CrawlJob' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Extract brand information from content
   */
  BrandApiV2.prototype.extractBrandInfo = function (data, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.post(
            '/brands/'.concat(data.brand_id, '/extract'),
            data,
            { package: 'protos', message: 'ExtractRequest' },
            { package: 'protos', message: 'ExtractResponse' },
            { token: token }
          ),
        ];
      });
    });
  };
  /**
   * Upload brand logo
   */
  BrandApiV2.prototype.uploadLogo = function (brandId, file, token) {
    return __awaiter(this, void 0, void 0, function () {
      var formData, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            formData = new FormData();
            formData.append('logo', file);
            return [
              4 /*yield*/,
              fetch(''.concat(this.baseUrl, '/brands/').concat(brandId, '/logo'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
                body: formData,
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Logo upload failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  };
  /**
   * Import brand data from file
   */
  BrandApiV2.prototype.importBrandData = function (brandId, file, format, token) {
    return __awaiter(this, void 0, void 0, function () {
      var formData, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            formData = new FormData();
            formData.append('file', file);
            formData.append('format', format);
            return [
              4 /*yield*/,
              fetch(''.concat(this.baseUrl, '/brands/').concat(brandId, '/import'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
                body: formData,
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Import failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  };
  /**
   * Export brand data
   */
  BrandApiV2.prototype.exportBrandData = function (brandId, format, token) {
    return __awaiter(this, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(this.baseUrl, '/brands/')
                  .concat(brandId, '/export?format=')
                  .concat(format),
                {
                  method: 'GET',
                  headers: {
                    Authorization: 'Bearer '.concat(token),
                  },
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Export failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.blob()];
        }
      });
    });
  };
  /**
   * Validate brand data
   */
  BrandApiV2.prototype.validateBrandData = function (data, token) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.post(
            '/brands/validate',
            data,
            { package: 'protos', message: 'Brand' },
            { package: 'protos', message: 'ValidationResponse' },
            { token: token }
          ),
        ];
      });
    });
  };
  return BrandApiV2;
})(ProtoService);
export { BrandApiV2 };
// Export singleton instance
export var brandApiV2 = new BrandApiV2();
//# sourceMappingURL=brand-api.js.map
