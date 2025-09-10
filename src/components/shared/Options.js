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
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
var Options = function (_a) {
  var edit = _a.edit,
    setEdit = _a.setEdit,
    regenerateImage = _a.regenerateImage;
  var _b = useState(false),
    loading = _b[0],
    setLoading = _b[1];
  var handleEdit = function () {
    if (edit === true) {
      setEdit('save');
    } else if (edit === false) {
      setEdit(true);
    }
  };
  var handleClick = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(true);
            return [4 /*yield*/, regenerateImage()];
          case 1:
            _a.sent();
            setLoading(false);
            return [2 /*return*/];
        }
      });
    });
  };
  return _jsxs('div', {
    className: 'flex flex-row mb-[13px] mt-auto '.concat(
      edit === false ? 'justify-end' : 'justify-between',
      '  w-full  items-center p-1 text-white'
    ),
    children: [
      _jsx('button', {
        onClick: function () {
          return setEdit(false);
        },
        className: ''.concat(
          edit === false ? 'hidden' : '',
          ' bg-[#5850EC] w-[29px] h-[29px] rounded-md flex justify-center items-center'
        ),
        children: _jsx('svg', {
          width: '11',
          height: '12',
          viewBox: '0 0 11 12',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          children: _jsx('path', {
            fillRule: 'evenodd',
            clipRule: 'evenodd',
            d: 'M0.400391 9.64177L1.85761 11.099L5.50028 7.45632L9.14388 11.0999L10.6011 9.6427L6.9575 5.9991L10.6009 2.35566L9.14372 0.898438L5.50028 4.54188L1.85777 0.899372L0.400546 2.35659L4.04305 5.9991L0.400391 9.64177Z',
            fill: 'white',
          }),
        }),
      }),
      _jsxs('div', {
        className: 'flex flex-row gap-1 ',
        children: [
          _jsx('button', {
            onClick: handleEdit,
            className: 'bg-[#5850EC] w-[29px] h-[29px] rounded-md flex justify-center items-center',
            children:
              edit === true
                ? _jsx('svg', {
                    width: '13',
                    height: '10',
                    viewBox: '0 0 13 10',
                    fill: 'none',
                    xmlns: 'http://www.w3.org/2000/svg',
                    children: _jsx('path', {
                      d: 'M4.55937 9.75026L0.046875 5.23776L1.175 4.10964L4.55937 7.49401L11.8229 0.230469L12.951 1.35859L4.55937 9.75026Z',
                      fill: 'white',
                    }),
                  })
                : _jsx('svg', {
                    width: '17',
                    height: '16',
                    viewBox: '0 0 17 16',
                    fill: 'none',
                    xmlns: 'http://www.w3.org/2000/svg',
                    children: _jsx('path', {
                      d: 'M16.1785 1.76077L14.7392 0.321531C14.3105 -0.107177 13.6062 -0.107177 13.1469 0.321531L1.51053 11.9579L1.44928 12.0191L0.5 16L4.48086 15.0507L16.1785 3.35311C16.6072 2.89378 16.6072 2.18947 16.1785 1.76077ZM2.15359 12.2029L12.1976 2.15885L14.3411 4.30239L4.29713 14.3464L2.15359 12.2029ZM1.90861 12.7847L3.71531 14.5914L1.32679 15.1732L1.90861 12.7847ZM15.7498 2.89378L14.8005 3.84306L12.6569 1.69952L13.6062 0.750239C13.79 0.566507 14.1268 0.566507 14.3105 0.750239L15.7498 2.18947C15.8416 2.28134 15.9029 2.40383 15.9029 2.55694C15.9029 2.67943 15.8416 2.80191 15.7498 2.89378Z',
                      fill: 'white',
                    }),
                  }),
          }),
          _jsxs('button', {
            disabled: loading,
            className: 'bg-[#5850EC] w-[29px] h-[29px] rounded-md flex justify-center items-center',
            onClick: handleClick,
            children: [
              !loading &&
                _jsx('svg', {
                  width: '11',
                  height: '12',
                  viewBox: '0 0 11 12',
                  fill: 'none',
                  xmlns: 'http://www.w3.org/2000/svg',
                  children: _jsx('path', {
                    fillRule: 'evenodd',
                    clipRule: 'evenodd',
                    d: 'M0.785714 0C0.994099 0 1.19395 0.0790176 1.3413 0.21967C1.48865 0.360322 1.57143 0.551088 1.57143 0.75V2.32575C2.22517 1.6892 3.03791 1.22198 3.93308 0.968087C4.82826 0.714194 5.77641 0.681989 6.68822 0.874504C7.60004 1.06702 8.44551 1.47792 9.145 2.0685C9.84449 2.65908 10.375 3.4099 10.6865 4.25025C10.7243 4.34382 10.742 4.44367 10.7387 4.5439C10.7354 4.64413 10.711 4.74271 10.6671 4.83379C10.6231 4.92488 10.5605 5.00663 10.4828 5.07421C10.4052 5.14178 10.3142 5.19381 10.2151 5.22722C10.1161 5.26063 10.011 5.27473 9.90614 5.2687C9.80128 5.26267 9.69874 5.23663 9.6046 5.19211C9.51046 5.1476 9.42663 5.08551 9.35807 5.00953C9.28951 4.93355 9.2376 4.84521 9.20543 4.74975C8.96825 4.10986 8.55364 3.54339 8.00578 3.11068C7.45793 2.67798 6.79735 2.39526 6.09444 2.29266C5.39153 2.19006 4.67263 2.27141 4.01434 2.52806C3.35605 2.7847 2.78303 3.20701 2.35636 3.75H4.71429C4.92267 3.75 5.12252 3.82902 5.26987 3.96967C5.41722 4.11032 5.5 4.30109 5.5 4.5C5.5 4.69891 5.41722 4.88968 5.26987 5.03033C5.12252 5.17098 4.92267 5.25 4.71429 5.25H0.785714C0.57733 5.25 0.37748 5.17098 0.23013 5.03033C0.0827803 4.88968 0 4.69891 0 4.5V0.75C0 0.551088 0.0827803 0.360322 0.23013 0.21967C0.37748 0.0790176 0.57733 0 0.785714 0ZM0.792 6.79275C0.8893 6.75995 0.992416 6.74576 1.09546 6.751C1.19851 6.75623 1.29946 6.7808 1.39256 6.82328C1.48566 6.86576 1.56908 6.92534 1.63806 6.9986C1.70703 7.07186 1.76022 7.15737 1.79457 7.25025C2.03175 7.89014 2.44636 8.45661 2.99421 8.88932C3.54207 9.32202 4.20265 9.60474 4.90556 9.70734C5.60847 9.80994 6.32737 9.72859 6.98566 9.47194C7.64395 9.2153 8.21697 8.79299 8.64364 8.25H6.28571C6.07733 8.25 5.87748 8.17098 5.73013 8.03033C5.58278 7.88968 5.5 7.69891 5.5 7.5C5.5 7.30109 5.58278 7.11032 5.73013 6.96967C5.87748 6.82902 6.07733 6.75 6.28571 6.75H10.2143C10.4227 6.75 10.6225 6.82902 10.7699 6.96967C10.9172 7.11032 11 7.30109 11 7.5V11.25C11 11.4489 10.9172 11.6397 10.7699 11.7803C10.6225 11.921 10.4227 12 10.2143 12C10.0059 12 9.80605 11.921 9.6587 11.7803C9.51135 11.6397 9.42857 11.4489 9.42857 11.25V9.67425C8.77483 10.3108 7.96209 10.778 7.06692 11.0319C6.17174 11.2858 5.22359 11.318 4.31178 11.1255C3.39996 10.933 2.55449 10.5221 1.855 9.9315C1.15551 9.34092 0.625019 8.5901 0.3135 7.74975C0.279133 7.65687 0.264269 7.55844 0.269757 7.46008C0.275245 7.36172 0.300977 7.26536 0.345483 7.17649C0.38999 7.08762 0.4524 7.00799 0.529148 6.94215C0.605897 6.87631 0.695481 6.82554 0.792786 6.79275H0.792Z',
                    fill: 'white',
                  }),
                }),
              loading &&
                _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 15, thickness: 7 }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default Options;
//# sourceMappingURL=Options.js.map
