import { jsx as _jsx } from 'react/jsx-runtime';
var ProgressComponent = function (_a) {
  var progress = _a.progress;
  return _jsx('div', {
    className: 'relative pt-1',
    children: _jsx('div', {
      className: 'overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200',
      children: _jsx('div', {
        style: { width: ''.concat(progress, '%') },
        className:
          'shadow-none flex flex-col text-center whitespace-pre-wrap justify-center bg-gradient-to-r from-[#5145CD] to-[#9B38B7] text-white',
      }),
    }),
  });
};
export default ProgressComponent;
//# sourceMappingURL=ProgressComponent.js.map
