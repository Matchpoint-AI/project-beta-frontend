var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
var MyAutoComplete = function (_a) {
    var options = _a.options, currentValues = _a.currentValues, setCurrentValues = _a.setCurrentValues, _b = _a.style, style = _b === void 0 ? false : _b;
    return (_jsx(Autocomplete, { options: options, multiple: true, className: "w-full", value: currentValues, onChange: function (event, newValue) {
            setCurrentValues(newValue);
        }, renderTags: function (tags, getTagProps) {
            return tags.map(function (item, index) {
                var rest = __rest(getTagProps({ index: index }), []);
                return (_jsx(Chip, { variant: "solid", sx: style
                        ? {
                            margin: 0.5,
                            backgroundColor: '#E5EDFF',
                            color: '#4B5563',
                            borderRadius: '6px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '12px',
                            fontWeight: 500,
                            lineHeight: '18px',
                            textAlign: 'center',
                            textDecorationSkipInk: 'none',
                            textUnderlinePosition: 'from-font',
                        }
                        : null, style: !style
                        ? {
                            backgroundColor: '#BCF0DA',
                            color: 'black',
                            borderRadius: '6px',
                        }
                        : undefined, endDecorator: _jsx(ChipDelete, __assign({ variant: "plain", style: !style ? { backgroundColor: '#BCF0DA', color: 'gray' } : undefined }, rest)), children: item }, index));
            });
        }, renderInput: function (params) {
            return (_jsx(TextField, __assign({}, params, { sx: {
                    '& .MuiOutlinedInput-root': {
                        minHeight: '52px',
                        borderRadius: '8px',
                        borderColor: 'gray.300',
                        borderWidth: '1px',
                        '& fieldset': {
                            borderColor: 'gray.300',
                            borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                            borderColor: 'gray.300',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'gray.300',
                        },
                    },
                }, label: "" })));
        } }));
};
export default MyAutoComplete;
//# sourceMappingURL=MyAutoComplete.js.map