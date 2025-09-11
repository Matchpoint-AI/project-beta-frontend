import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useEffect, useRef, useState } from 'react';
var FileInput = function (_a) {
  var accept = _a.accept,
    required = _a.required,
    error = _a.error,
    onChange = _a.onChange;
  var _b = useState('No file chosen'),
    fileName = _b[0],
    setFileName = _b[1];
  var _c = useState(required && error),
    requiredError = _c[0],
    setRequiredError = _c[1];
  var inputColors = useRef({
    validColors: 'bg-[#5145CD] hover:bg-[#6875F5]',
    errorColors: 'bg-[#F05252] hover:bg-[#f56868]',
  }).current;
  var _d = useState(inputColors.validColors),
    inputStateColors = _d[0],
    setStateColors = _d[1];
  var handleFileChange = function (event) {
    var _a;
    var file = event.target.files[0];
    setFileName(
      ((_a = event.target.files) === null || _a === void 0 ? void 0 : _a.length)
        ? event.target.files[0].name
        : 'No file chosen'
    );
    onChange && onChange(file);
    setRequiredError(false);
  };
  useEffect(
    function () {
      setRequiredError(required && error);
    },
    [required(_error)]
  );
  useEffect(
    function () {
      if (requiredError) setStateColors(inputColors.errorColors);
      else setStateColors(inputColors.validColors);
    },
    [requiredError]
  );
  // #f56868
  return _jsxs(_Fragment, {
    children: [
      _jsxs('div', {
        className: 'flex items-center space-x-4 border rounded-lg min-w-[250px] sm:w-3/5 w-4/5',
        children: [
          _jsxs('label', {
            className: 'flex items-center px-4 py-2 '.concat(
              inputStateColors,
              ' text-white rounded-l-lg cursor-pointer'
            ),
            children: [
              _jsx('span', { className: 'font-medium', children: 'Choose file' }),
              _jsx('input', {
                type: 'file',
                className: 'hidden',
                onChange: handleFileChange,
                accept: accept,
              }),
            ],
          }),
          _jsx('span', { className: 'text-gray-500', children: fileName }),
        ],
      }),
      requiredError &&
        _jsx('p', {
          className: 'font-medium text-[#F05252] capitalize mt-1 text-sm',
          children: 'required field',
        }),
    ],
  });
};
export default FileInput;
//# sourceMappingURL=FileInput.js.map
