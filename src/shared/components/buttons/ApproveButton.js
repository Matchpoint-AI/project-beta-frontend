import { jsx as _jsx } from 'react/jsx-runtime';
import CircularProgress from '@mui/material/CircularProgress';
var ApproveButton = function (_a) {
  var double = _a.double,
    handleApproveAll = _a.handleApproveAll,
    loading = _a.loading;
  return _jsx('button', {
    disabled: double || loading,
    onClick: handleApproveAll,
    className: 'p-[10px] w-28 rounded-lg justify-center items-center gap-2 inline-flex '.concat(
      loading ? 'bg-gray-500' : 'bg-indigo-700',
      ' hover:cursor-pointer'
    ),
    children: loading
      ? _jsx(CircularProgress, { size: 20, sx: { color: '#ffffff' } })
      : _jsx('span', { className: 'text-white text-sm font-medium', children: 'Approve All' }),
  });
};
export default ApproveButton;
//# sourceMappingURL=ApproveButton.js.map
