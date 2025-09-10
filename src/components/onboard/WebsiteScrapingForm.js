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
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useContext } from 'react';
import { BrandContext } from '../../context/BrandContext';
import scrapeBrandWebsite from '../../helpers/scrapeBrandWebsite';
// import { ConnectInstagram } from "./ConnectToInstagram";
import { ScrapeWebsiteBtn } from '../ScrapeWebsiteBtn';
import isUrl from 'is-url';
import BusinessFormInput from '../../shared/components/inputs/BusinessFormInput';
import ErrorToast from '../../shared/components/feedback/ErrorToast';
export default function WebsiteScrapingForm() {
  var _this = this;
  var _a = useContext(BrandContext),
    businessInfo = _a.businessInfo,
    setBusinessInfo = _a.setBusinessInfo;
  var _b = useState(0),
    runValidation = _b[0],
    setRunValidation = _b[1];
  var _c = useState({ count: 0, error: false }),
    nameError = _c[0],
    setNameError = _c[1];
  var _d = useState({ count: 0, error: false }),
    websiteError = _d[0],
    setWebsiteError = _d[1];
  var _e = useState(''),
    progressDescription = _e[0],
    setProgressDescription = _e[1];
  var _f = useState(false),
    scrapingError = _f[0],
    setScrapingError = _f[1];
  var validateWebsite = function (website) {
    if (!website || website === '') {
      return false;
    }
    if (!/^https?:\/\//i.test(website)) website = 'https://' + website;
    return isUrl(website);
  };
  var validateName = function (name) {
    if (name.trim() === '' || !/^[a-zA-Z0-9 ]*$/.test(name)) {
      return false;
    }
    return true;
  };
  var runScraping = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var e_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            setProgressDescription('Scraping Website...');
            return [4 /*yield*/, scrapeBrandWebsite(businessInfo, setBusinessInfo)];
          case 1:
            _a.sent();
            return [3 /*break*/, 3];
          case 2:
            e_1 = _a.sent();
            setScrapingError(true);
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  var submitBrandData = function () {
    if (
      !businessInfo.name ||
      businessInfo.name === '' ||
      !businessInfo.website ||
      businessInfo.website === ''
    )
      setRunValidation(function (old) {
        return old + 1;
      });
    else {
      runScraping();
    }
  };
  return _jsxs('div', {
    className: 'flex flex-col gap-6',
    children: [
      _jsx(BusinessFormInput, {
        subject: 'name',
        title: 'What\u2019s the business called?',
        placeholder: 'Company name',
        type: 'text',
        validateInput: validateName,
        runValidation: runValidation,
        setFormError: setNameError,
      }),
      _jsx(BusinessFormInput, {
        subject: 'website',
        title: 'Add the business website',
        description: 'We\u2019ll import info on your brand, products and audience',
        placeholder: 'Company website',
        type: 'link',
        validateInput: validateWebsite,
        runValidation: runValidation,
        setFormError: setWebsiteError,
      }),
      _jsx(ScrapeWebsiteBtn, {
        handleSubmit: submitBrandData,
        nameError: nameError,
        websiteError: websiteError,
        progressDescription: progressDescription,
        scrapingError: scrapingError,
      }),
      _jsx(ErrorToast, {
        open: scrapingError,
        onClose: function () {
          return setScrapingError(false);
        },
        message: 'Error fetching data from the website! Try again later',
      }),
    ],
  });
}
//# sourceMappingURL=WebsiteScrapingForm.js.map
