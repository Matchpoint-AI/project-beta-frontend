import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { CircularProgress } from '@mui/material';
var LoadingModal = function (_a) {
  var steps = _a.steps,
    isOpen = _a.isOpen;
  if (!isOpen) return null;
  return _jsx('div', {
    className:
      'fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 lg:p-0',
    children: _jsxs('div', {
      className: 'bg-white p-8 rounded shadow-lg w-[400px]',
      children: [
        _jsx('h2', { className: 'text-xl font-semibold mb-4', children: 'Exporting Content' }),
        steps.map(function (step, index) {
          return _jsxs(
            'div',
            {
              className: 'flex items-center mb-4',
              children: [
                step.loading
                  ? _jsx(CircularProgress, { size: 20 })
                  : step.complete
                    ? _jsx('svg', {
                        xmlns: 'http://www.w3.org/2000/svg',
                        className: 'h-5 w-5 text-green-500',
                        viewBox: '0 0 20 20',
                        fill: 'currentColor',
                        children: _jsx('path', {
                          fillRule: 'evenodd',
                          d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm-1.292-4.293a1 1 0 011.414 0l5-5a1 1 0 10-1.414-1.414l-4.293 4.293-1.293-1.293a1 1 0 00-1.414 1.414l2 2z',
                          clipRule: 'evenodd',
                        }),
                      })
                    : _jsx(CircularProgress, { size: 20 }),
                _jsx('span', { className: 'ml-4', children: step.label }),
              ],
            },
            index
          );
        }),
      ],
    }),
  });
};
export default LoadingModal;
//# sourceMappingURL=ExportLoading.js.map
