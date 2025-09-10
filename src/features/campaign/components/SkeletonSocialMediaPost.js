import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
var SkeletonSocialMediaPost = function () {
  return _jsxs('div', {
    className: 'animate-pulse bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 w-full',
    children: [
      _jsx('div', { className: 'h-4 w-32 bg-gray-200 rounded mb-4' }),
      _jsx('div', {
        className: 'flex flex-row gap-4',
        children: [1, 2, 3].map(function (i) {
          return _jsxs(
            'div',
            {
              className: 'flex-1 flex flex-col items-center bg-gray-50 rounded-lg p-3',
              children: [
                _jsx('div', { className: 'w-full aspect-square bg-gray-200 rounded mb-2' }),
                _jsx('div', { className: 'h-4 w-3/4 bg-gray-200 rounded mb-1' }),
                _jsx('div', { className: 'h-3 w-1/2 bg-gray-200 rounded mb-2' }),
                _jsx('div', { className: 'h-3 w-2/3 bg-gray-200 rounded mb-2' }),
                _jsxs('div', {
                  className: 'flex flex-row gap-2 mt-2 w-full justify-between',
                  children: [
                    _jsx('div', { className: 'h-8 w-16 bg-gray-200 rounded' }),
                    _jsx('div', { className: 'h-8 w-16 bg-gray-200 rounded' }),
                  ],
                }),
              ],
            },
            i
          );
        }),
      }),
    ],
  });
};
export default SkeletonSocialMediaPost;
//# sourceMappingURL=SkeletonSocialMediaPost.js.map
