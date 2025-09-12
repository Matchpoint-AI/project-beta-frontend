import { jsx as _jsx } from "react/jsx-runtime";
import ClearIcon from '@mui/icons-material/Clear';
export default function ColorSpan(_a) {
    var index = _a.index, color = _a.color, removeColor = _a.removeColor;
    return (_jsx("span", { className: "w-10 h-10 rounded-full mr-2 inline-block group shadow-md", style: { backgroundColor: color }, children: _jsx("button", { type: "button", className: "w-full h-full bg-[#00000080] rounded-full group-hover:flex hidden relative cursor-pointer", onClick: function () { return removeColor(index); }, children: _jsx(ClearIcon, { sx: {
                    fontSize: '18px',
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                } }) }) }, index));
}
//# sourceMappingURL=ColorSpan.js.map