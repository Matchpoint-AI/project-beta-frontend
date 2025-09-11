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
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { MdCalendarToday } from 'react-icons/md';
import { PiExportBold } from 'react-icons/pi';
import { MdAutoAwesome } from 'react-icons/md';
var TabItems = function (_a) {
  var _b = _a.currentPage,
    currentPage = _b === void 0 ? 1 : _b,
    onPageChange = _a.onPageChange,
    setApprovePopup = _a.setApprovePopup,
    onApprove = _a.onApprove;
  var id = useParams().id;
  var profile = useAuth().profile;
  var handleExportChange = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl, params, response, data, approved, _error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            endpointUrl = getServiceURL('data');
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            params = new URLSearchParams({
              campaign_id: id,
            });
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/check-approved?').concat(params.toString()), {
                method: 'GET',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) throw new Error('Failed to fetch data');
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            approved = data.approved;
            setApprovePopup(approved);
            if (approved) {
              onApprove === null || onApprove === void 0 ? void 0 : onApprove();
            }
            if (onPageChange && approved === false) onPageChange(3);
            return [3 /*break*/, 5];
          case 4:
            _error_1 = _a.sent();
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  return _jsxs('div', {
    className: 'flex flex-row gap-4',
    children: [
      _jsxs('button', {
        onClick: function () {
          return onPageChange && onPageChange(1);
        },
        className: 'flex p-3 gap-2 items-center rounded-md '.concat(
          currentPage === 1
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        ),
        children: [
          currentPage === 1
            ? _jsx('img', { src: '/collection-active.svg', alt: 'Active Collection' })
            : _jsx('img', {
                src: '/collection-disabled.svg',
                alt: 'Disabled Collection',
                className: 'w-6 h-6',
              }),
          _jsx('span', { className: 'font-normal text-base leading-5', children: 'Library View' }),
        ],
      }),
      _jsxs('button', {
        onClick: function () {
          return onPageChange && onPageChange(2);
        },
        className: 'flex gap-2 items-center p-3 rounded-md '.concat(
          currentPage === 2
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        ),
        children: [
          _jsx(MdCalendarToday, { size: 24 }),
          _jsx('span', { className: 'font-normal text-base leading-5', children: 'Calendar View' }),
        ],
      }),
      _jsxs('button', {
        onClick: handleExportChange,
        className: 'flex p-3 gap-2 items-center rounded-md '.concat(
          currentPage === 3
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        ),
        children: [
          _jsx(PiExportBold, { size: 24 }),
          _jsx('span', { className: 'font-normal text-base leading-5', children: 'Export View' }),
        ],
      }),
      _jsxs('button', {
        onClick: function () {
          return onPageChange && onPageChange(4);
        },
        className: 'flex p-3 gap-2 items-center rounded-md '.concat(
          currentPage === 4
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        ),
        children: [
          _jsx(MdAutoAwesome, { size: 24 }),
          _jsx('span', { className: 'font-normal text-base leading-5', children: 'AI Planner' }),
        ],
      }),
    ],
  });
};
export default TabItems;
//# sourceMappingURL=TabItems.js.map
