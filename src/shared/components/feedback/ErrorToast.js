import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { FaCheckCircle } from 'react-icons/fa';
import { IoAlertCircle } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
export default function ErrorToast(_a) {
  var open = _a.open,
    onClose = _a.onClose,
    message = _a.message,
    _b = _a.success,
    success = _b === void 0 ? false : _b,
    _c = _a.title,
    title = _c === void 0 ? (success ? 'Success' : 'Error') : _c,
    _d = _a.buttonText,
    buttonText = _d === void 0 ? (success ? 'Continue' : null) : _d,
    onButtonClick = _a.onButtonClick;
  if (!open) return null;
  var handleButtonClick = function () {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };
  var bgColor = success ? 'bg-green-600' : 'bg-purple-600';
  var hoverColor = success ? 'hover:bg-green-700' : 'hover:bg-purple-700';
  return _jsxs('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
    children: [
      _jsxs('div', {
        className: 'relative w-full max-w-md rounded-lg bg-white shadow-lg',
        children: [
          _jsx('button', {
            className: 'absolute right-4 top-4 text-gray-500 hover:text-gray-700',
            onClick: onClose,
            'aria-label': 'Close',
            children: _jsx(MdClose, { size: 20 }),
          }),
          _jsx('div', {
            className: 'px-6 pt-6 pb-4 flex justify-center',
            children: success
              ? _jsx(FaCheckCircle, { className: 'h-12 w-12 text-green-600' })
              : _jsx(IoAlertCircle, { className: 'h-12 w-12 text-purple-600' }),
          }),
          _jsxs('div', {
            className: 'px-6 pb-6',
            children: [
              _jsx('h3', {
                className: 'text-center text-lg font-semibold text-gray-900 mb-2',
                children: title,
              }),
              _jsx('p', { className: 'text-center text-gray-700', children: message }),
            ],
          }),
          buttonText
            ? _jsx('div', {
                className: 'px-6 pb-6',
                children: _jsx('button', {
                  className: 'w-full rounded-md py-2 px-4 text-white '
                    .concat(bgColor, ' ')
                    .concat(hoverColor, ' transition-colors'),
                  onClick: handleButtonClick,
                  children: buttonText,
                }),
              })
            : null,
        ],
      }),
      _jsx('div', { className: 'absolute inset-0 -z-10', onClick: onClose }),
    ],
  });
}
//# sourceMappingURL=ErrorToast.js.map
