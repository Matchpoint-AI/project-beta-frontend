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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import Dropdown from '../../shared/components/ui/Dropdown';
import { CampaignContext } from '../../context/CampaignContext';
import { BrandContext } from '../../context/BrandContext';
import FormsContainer from '../shared/FormsContainer';
import WebsiteOwnership from '../WebsiteOwnership';
import NextButton from '../../shared/components/buttons/NextButton';
import BackButton from '../../shared/components/buttons/BackButton';
import KeyFeatures from '../onboard/KeyFeatures';
import FormInputBox from '../../shared/components/inputs/FormInputBox';
import { SparklesMessage } from '../../shared/components/ui/SparklesMessage';
import ErrorToast from '../../shared/components/feedback/ErrorToast';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../../features/auth/context/AuthContext';
import scrapeProductDefault from './scrapeProduct';
import posthog from '../../helpers/posthog';
var ServiceForm = function (_a) {
  var handleNext = _a.handleNext,
    handleBack = _a.handleBack,
    _b = _a.review,
    review = _b === void 0 ? false : _b,
    setService = _a.setService;
  var _c = useContext(BrandContext),
    businessInfo = _c.businessInfo,
    setBusinessInfo = _c.setBusinessInfo;
  var _d = useContext(CampaignContext),
    campaignInfo = _d.campaignInfo,
    setCampaignInfo = _d.setCampaignInfo;
  var _e = useState(null),
    product = _e[0],
    setProduct = _e[1];
  var _f = useState(''),
    productName = _f[0],
    setProductName = _f[1];
  var _g = useState(''),
    productDescription = _g[0],
    setProductDescription = _g[1];
  var _h = useState(false),
    newProduct = _h[0],
    setNewProduct = _h[1];
  var _j = useState(''),
    productLink = _j[0],
    setProductLink = _j[1];
  var isMounted = useRef(false);
  var _k = useState(false),
    error = _k[0],
    setError = _k[1];
  var _l = useState(false),
    nameError = _l[0],
    setnameError = _l[1];
  var _m = useState(false),
    loading = _m[0],
    setLoading = _m[1];
  var _o = useState([]),
    features = _o[0],
    setFeatures = _o[1];
  var profile = useAuth().profile;
  // Add validation state for the Next button
  var _p = useState(false),
    isFormValid = _p[0],
    setIsFormValid = _p[1];
  var _q = useState(false),
    scrapeSuccess = _q[0],
    setScrapeSuccess = _q[1];
  var scrapeProduct;
  if (typeof window !== 'undefined' && window.__mockScrapeProduct) {
    scrapeProduct = window.__mockScrapeProduct;
  } else {
    scrapeProduct = scrapeProductDefault;
  }
  useEffect(function () {
    if (businessInfo.products === undefined) {
      setBusinessInfo(__assign(__assign({}, businessInfo), { products: [] }));
      return;
    }
    // Set default product description if product is already selected in campaignInfo
    var selectedProduct = businessInfo.products.find(function (product) {
      return product.name === campaignInfo.product;
    });
    if (selectedProduct) {
      setProductDescription(selectedProduct.description);
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), { productDescription: selectedProduct.description });
      });
    }
    // Log product features
  }, []);
  // Add validation effect
  useEffect(
    function () {
      // Form is valid if we have a product name (either from scraping or manual entry)
      // OR if we have a product link that could be scraped
      var hasProductName = Boolean(productName && productName.trim() !== '');
      var hasProductLink = Boolean(productLink && productLink.trim() !== '');
      var isValid = hasProductName || hasProductLink;
      setIsFormValid(isValid);
    },
    [productName, productLink]
  );
  var handleSubmit = function (e) {
    e.preventDefault();
    // Additional validation before submission
    if (!productName || productName.trim() === '') {
      setnameError(true);
      return;
    }
    setCampaignInfo(function (prev) {
      return __assign(__assign({}, prev), {
        product: productName,
        productDescription: productDescription,
        productLink: productLink,
      });
    });
    if (posthog.__loaded) {
      posthog.capture('Campaign Step Completed', {
        distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
        step: 2,
      });
    }
    handleNext();
  };
  var handleProductScrape = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var scrapedProduct_1, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!productLink) {
              setError(true);
              return [2 /*return*/];
            }
            setLoading(true);
            setError(false);
            setScrapeSuccess(false);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            return [4 /*yield*/, scrapeProduct(productLink)];
          case 2:
            scrapedProduct_1 = _a.sent();
            if (scrapedProduct_1 && scrapedProduct_1.name) {
              setProductName(scrapedProduct_1.name);
              setProductDescription(scrapedProduct_1.description || '');
              setFeatures(scrapedProduct_1.product_features || []);
              // Update business info with new product features
              setBusinessInfo(function (prev) {
                  'Updating business info with new product features:',
                  scrapedProduct_1.product_features
                );
                return __assign(__assign({}, prev), {
                  product_features: scrapedProduct_1.product_features || [],
                  key_features: scrapedProduct_1.product_features || [],
                });
              });
              setCampaignInfo(function (prev) {
                return __assign(__assign({}, prev), {
                  product: scrapedProduct_1.name,
                  productDescription: scrapedProduct_1.description || '',
                  productLink: productLink,
                });
              });
              // Show success feedback
              setScrapeSuccess(true);
            } else {
              // Handle case where scraping succeeded but no product name was found
              console.warn('Scraping succeeded but no product name found');
              setError(true);
              setProductName('');
              setProductDescription('');
              setFeatures([]);
            }
            return [3 /*break*/, 5];
          case 3:
            error_1 = _a.sent();
            console.error('Error scraping product:', error_1);
            setError(true);
            // Reset form state on error
            setProductName('');
            setProductDescription('');
            setFeatures([]);
            return [3 /*break*/, 5];
          case 4:
            setLoading(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var nameChangeHandler = function (e) {
    var value = e.target.value;
    setnameError(!value);
    setProductName(value);
  };
  var productChangeHandler = function (value, index) {
    var _a, _b;
      'Selected product:',
      businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.products[index - 1]
    );
    if (value !== 'Add Product or Service') {
      var selectedProduct =
        businessInfo === null || businessInfo === void 0
          ? void 0
          : businessInfo.products[index - 1];
      setProductName(value);
      setProductDescription(
        selectedProduct === null || selectedProduct === void 0
          ? void 0
          : selectedProduct.description
      );
      setProduct(selectedProduct);
      setService(value);
      setNewProduct(false);
      setCampaignInfo(__assign(__assign({}, campaignInfo), { newProduct: false }));
      // Try both field names to ensure we get the features
      var features_1 =
        (_b =
          (_a =
            selectedProduct === null || selectedProduct === void 0
              ? void 0
              : selectedProduct.product_features) !== null && _a !== void 0
            ? _a
            : selectedProduct === null || selectedProduct === void 0
              ? void 0
              : selectedProduct.key_features) !== null && _b !== void 0
          ? _b
          : [];
      setFeatures(features_1);
    } else {
      setNewProduct(true);
      setProductDescription('');
      setProductName('');
      setCampaignInfo(__assign(__assign({}, campaignInfo), { newProduct: true }));
      setFeatures([]);
    }
  };
  useEffect(
    function () {
      var _a, _b, _c, _d, _e, _f, _g;
      if (isMounted.current) return;
      if (
        (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.product) ||
        (campaignInfo === null || campaignInfo === void 0
          ? void 0
          : campaignInfo.productDescription)
      ) {
        setProductName(
          (_a =
            campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.product) !==
            null && _a !== void 0
            ? _a
            : ''
        );
        setProductDescription(
          (_b =
            campaignInfo === null || campaignInfo === void 0
              ? void 0
              : campaignInfo.productDescription) !== null && _b !== void 0
            ? _b
            : ''
        );
      } else if (
        (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.products) &&
        (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.products.length) >
          0
      ) {
        productChangeHandler(
          (_c =
            businessInfo === null || businessInfo === void 0
              ? void 0
              : businessInfo.products[0]) === null || _c === void 0
            ? void 0
            : _c.name,
          1
        );
      }
      // Set features from campaignInfo if available, otherwise from businessInfo
      if (
        ((_d =
          campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.product_features) === null || _d === void 0
          ? void 0
          : _d.length) > 0
      ) {
        setFeatures(campaignInfo.product_features);
      } else if (
        (_e = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.products) ===
          null || _e === void 0
          ? void 0
          : _e[0]
      ) {
        var firstProduct = businessInfo.products[0];
        var features_2 =
          (_g =
            (_f = firstProduct.product_features) !== null && _f !== void 0
              ? _f
              : firstProduct.key_features) !== null && _g !== void 0
            ? _g
            : [];
        setFeatures(features_2);
      }
      if (campaignInfo.newProduct !== undefined) {
        setNewProduct(campaignInfo.newProduct);
      } else if (!businessInfo.products || businessInfo.products.length === 0) {
        setNewProduct(true);
      }
      if (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.productLink) {
        setProductLink(
          campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.productLink
        );
      }
      isMounted.current = true;
    },
    [businessInfo, campaignInfo]
  );
  // Add debug logging for features changes
  useEffect(
    function () {
    },
    [features]
  );
  return _jsxs(_Fragment, {
    children: [
      _jsx(FormsContainer, {
        children: _jsxs('form', {
          id: 'service_form',
          onSubmit: handleSubmit,
          children: [
            (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.products) &&
              (businessInfo === null || businessInfo === void 0
                ? void 0
                : businessInfo.products.length) > 0 &&
              _jsx(_Fragment, {
                children: _jsxs('div', {
                  className: 'mb-5',
                  children: [
                    _jsx('label', {
                      title: '',
                      className: 'block mb-2 text-base sm:text-xl font-medium text-gray-900',
                      children: 'Which service or product are you featuring?',
                    }),
                    _jsx('div', {
                      className: 'mb-2',
                      children: _jsx(SparklesMessage, {
                        children:
                          "Matchpoint will detect and store your business's services and products",
                      }),
                    }),
                    _jsx(
                      Dropdown,
                      // type="options"
                      {
                        // type="options"
                        options: __spreadArray(
                          ['Add Product or Service'],
                          businessInfo && businessInfo.products
                            ? businessInfo.products.map(function (p) {
                                return p.name;
                              })
                            : [],
                          true
                        ),
                        currentValue: newProduct ? 'Add Product or Service' : productName,
                        onUpdateContext: productChangeHandler,
                        className: 'w-full',
                      }
                    ),
                  ],
                }),
              }),
            _jsxs('div', {
              className: 'my-5',
              children: [
                _jsx('label', {
                  title: '',
                  className: 'block mb-2 text-base sm:text-xl font-medium text-gray-900',
                  children: 'If you have it, please provide a link to your product or service',
                }),
                _jsx(FormInputBox, {
                  styles: { backgroundColor: 'white' },
                  color: '#6B7280',
                  children: _jsx('input', {
                    value: productLink,
                    type: 'text',
                    placeholder: 'Link to Product/Service',
                    onChange: function (e) {
                      return setProductLink(e.target.value);
                    },
                    className: 'text-sm w-full bg-transparent outline-none text-[#111827]',
                  }),
                }),
                _jsx('button', {
                  type: 'button',
                  className:
                    'bg-[#5145CD] hover:bg-[#6875F5] text-white text-sm h-10 w-[100px] mt-2 rounded-lg font-bold flex items-center disabled:cursor-not-allowed justify-center',
                  onClick: handleProductScrape,
                  disabled: loading || !productLink,
                  children: loading
                    ? _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })
                    : 'Generate',
                }),
                scrapeSuccess &&
                  _jsx('p', {
                    className: 'text-[#0E9F6E] text-sm font-medium mt-2',
                    children: '\u2713 Product information successfully extracted!',
                  }),
                productLink &&
                  !productName &&
                  !loading &&
                  !scrapeSuccess &&
                  _jsx('p', {
                    className: 'text-[#6B7280] text-sm mt-2',
                    children: 'Click "Generate" to extract product information from the URL',
                  }),
              ],
            }),
            newProduct &&
              _jsx('div', {
                children: _jsxs('div', {
                  className: 'my-5',
                  children: [
                    _jsx('label', {
                      className: 'block mb-2 text-base sm:text-xl font-medium text-gray-900',
                      children: 'What is the service or product called?',
                    }),
                    _jsx(FormInputBox, {
                      styles: { backgroundColor: 'white' },
                      color: '#6B7280',
                      children: _jsx('input', {
                        value: productName,
                        type: 'text',
                        placeholder: 'Name the new Product/Service',
                        onChange: nameChangeHandler,
                        // onBlur={saveValue}
                        className: 'text-sm w-full bg- outline-none text-[#111827]',
                      }),
                    }),
                    nameError &&
                      _jsx('p', {
                        className: 'text-[#F05252] text-sm font-medium mt-1',
                        children: 'Please at least provide a name of your product',
                      }),
                  ],
                }),
              }),
            _jsxs('div', {
              className: 'my-8',
              children: [
                _jsx('label', {
                  title: '',
                  className: 'block mb-2 text-xl font-medium text-gray-900',
                  children: 'Service or Product description',
                }),
                _jsx(SparklesMessage, {
                  children:
                    'Matchpoint will try to provide a description through detection or the link above.',
                }),
                (newProduct ||
                  !(businessInfo === null || businessInfo === void 0
                    ? void 0
                    : businessInfo.products) ||
                  !(product === null || product === void 0 ? void 0 : product.description)) &&
                  _jsx('textarea', {
                    className:
                      'outline-none border border-[#6B7280] py-3 px-5 w-full h-[100px] resize-none rounded-lg mt-3 text-sm',
                    placeholder: 'Please provide a product description here.',
                    value: productDescription,
                    onChange: function (e) {
                      return setProductDescription(e.target.value);
                    },
                  }),
                (product === null || product === void 0 ? void 0 : product.description) &&
                  !newProduct &&
                  _jsx('div', {
                    className:
                      'bg-[#EBF5FF] p-6 mt-2 rounded-md text-[#6B7280] text-xs border-[0.3px] border-[#1C64F2]',
                    children: _jsx('p', {
                      children:
                        product === null || product === void 0 ? void 0 : product.description,
                    }),
                  }),
              ],
            }),
            _jsx(KeyFeatures, { pros: features }),
          ],
        }),
      }),
      _jsx(WebsiteOwnership, {}),
      !review &&
        _jsxs('div', {
          className: 'flex justify-between mb-10 w-[95%] md:w-full',
          children: [
            _jsx(BackButton, {
              onClick: function () {
                return handleBack();
              },
            }),
            _jsx(NextButton, {
              text: isFormValid ? 'Next' : 'Enter product details to continue',
              formId: 'service_form',
              disabled: !isFormValid || loading,
            }),
          ],
        }),
      _jsx(ErrorToast, {
        open: error,
        onClose: function () {
          return setError(false);
        },
        message:
          'Unable to extract product information from the provided URL. Please check the link and try again, or manually enter the product details below.',
      }),
    ],
  });
};
export default ServiceForm;
//# sourceMappingURL=ServiceForm.js.map
