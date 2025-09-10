import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export function SparklesMessage(_a) {
  var loading = _a.loading,
    children = _a.children;
  return _jsxs('div', {
    className: 'flex items-center rounded-md gap-2 bg-[#EBF5FF] p-1.5',
    children: [
      _jsx('img', {
        src: loading ? 'loading_spinner.svg' : '/sparkles.svg',
        alt: 'location',
        className: 'w-5 h-5',
      }),
      _jsx('p', { className: 'text-sm text-[#1C64F2]', children: children }),
    ],
  });
}
//# sourceMappingURL=SparklesMessage.js.map
