var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx } from 'react/jsx-runtime';
// import Close from "@mui/icons-material/Close";
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import { MuiChipsInput } from 'mui-chips-input';
var CustomInput = function (_a) {
  var options = _a.options,
    setOptions = _a.setOptions,
    limit = _a.limit;
  var handleChange = function (newChips) {
    if (newChips.length >= limit && limit !== -1) return;
    setOptions(newChips);
  };
  var handleDelete = function (key) {
    var newSelectedOption = __spreadArray([], options, true); // Create a copy of the array
    newSelectedOption.splice(key, 1); // Remove the element at the specified index
    setOptions(newSelectedOption); // Update the state with the new array
  };
  return _jsx(MuiChipsInput, {
    className: 'w-full rounded-md p-0 flex gap-2',
    placeholder: '',
    value: options,
    onChange: handleChange,
    disableEdition: true,
    sx: {
      '& .MuiOutlinedInput-root': {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: '8px',
        minheight: '52px',
        // maxWidth: "300px", // Set a fixed width
        // overflowX: "auto", // Enable horizontal scrolling
        // flexWrap: "nowrap", // Prevent wrapping
        // minWidth: "50px", // Set a minimum width
        padding: '4px 8px', // Adjust padding as needed
      },
    },
    renderChip: function (Component, key, props) {
      // eslint-disable-next-line react/prop-types
      var index = props.index,
        label = props.label;
      return _jsx(
        'div',
        {
          className: 'ml-1',
          children: _jsx(
            Chip,
            {
              variant: 'solid',
              style: {
                backgroundColor: '#BCF0DA',
                color: 'black',
                borderRadius: '6px',
              },
              endDecorator: _jsx(ChipDelete, {
                variant: 'plain',
                style: {
                  backgroundColor: '#BCF0DA',
                  color: 'gray',
                  fontSize: '1px',
                },
                onDelete: function () {
                  handleDelete(index);
                },
              }),
              children: label,
            },
            key
          ),
        },
        key
      );
    },
  });
};
export default CustomInput;
//# sourceMappingURL=CustomInput.js.map
