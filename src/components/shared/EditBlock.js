import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { FaRegEdit } from 'react-icons/fa';
export default function EditBlock(_a) {
  var onClick = _a.onClick,
    disabled = _a.disabled,
    className = _a.className;
  return _jsxs('button', {
    disabled: disabled,
    className: 'flex items-center gap-1 group '.concat(className),
    onClick: onClick,
    children: [
      _jsx('span', {
        className:
          'font-semibold text-[12px] sr-only text-[#3F83F8] capitalize group-disabled:text-[#9CA3AF]',
        children: 'edit block',
      }),
      _jsx(FaRegEdit, { color: disabled ? '#9CA3AF' : '#3F83F8', size: 16 }),
    ],
  });
}
//# sourceMappingURL=EditBlock.js.map
