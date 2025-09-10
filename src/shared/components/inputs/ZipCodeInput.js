var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
import { jsx as _jsx } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
// import Close from "@mui/icons-material/Close";
import { useContext } from 'react';
import { BrandContext } from '../../../context/BrandContext';
var ZipCodeInput = function (_a) {
  var currentValues = _a.currentValues,
    setCurrentValues = _a.setCurrentValues;
  var _b = useContext(BrandContext),
    businessInfo = _b.businessInfo,
    setBusinessInfo = _b.setBusinessInfo;
  var _c = useState([]),
    myOptions = _c[0],
    setMyOptions = _c[1];
  var _d = useState(null),
    zipCodesMap = _d[0],
    setzipCodesMap = _d[1];
  var _e = useState(''),
    zipcode = _e[0],
    setZipCode = _e[1];
  useEffect(function () {
    var myMap = new Map();
    fetch('/zip_codes.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        result.map(function (item) {
          myMap.set(item.zip, item.city_state);
          return item;
        });
        setzipCodesMap(myMap);
        var uniqueValues = new Set();
        Array.from(myMap).forEach(function (_a) {
          var value = _a[1];
          if (uniqueValues.size < 1000) {
            uniqueValues.add(value);
          }
        });
        var arr = Array.from(uniqueValues);
        setMyOptions(arr);
      });
  }, []);
  useEffect(
    function () {
      if (zipCodesMap === null) return;
      var findClosestMatch = function (locations) {
        if (locations === undefined) return;
        var results = [];
        var _loop_1 = function (location_1) {
          var closestMatch = '';
          var highestMatchScore = 0;
          Array.from(zipCodesMap).forEach(function (_a) {
            var value = _a[1];
            var matchScore = getMatchScore(location_1, value);
            if (matchScore > highestMatchScore) {
              highestMatchScore = matchScore;
              closestMatch = value;
            }
          });
          results.push(closestMatch);
        };
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
          var location_1 = locations_1[_i];
          _loop_1(location_1);
        }
        return Array.from(new Set(results));
      };
      // Simple function to calculate match score
      var getMatchScore = function (str1, str2) {
        var tokens1 = str1.toLowerCase().split(' ');
        var tokens2 = str2.toLowerCase().split(/[ ,/]+/);
        var score = 0;
        for (var _i = 0, tokens1_1 = tokens1; _i < tokens1_1.length; _i++) {
          var token1 = tokens1_1[_i];
          for (var _a = 0, tokens2_1 = tokens2; _a < tokens2_1.length; _a++) {
            var token2 = tokens2_1[_a];
            if (token1 === token2) {
              score++;
            }
          }
        }
        return score;
      };
      var results = findClosestMatch(currentValues);
      if (
        (results === null || results === void 0 ? void 0 : results.length) === 1 &&
        results[0] === ''
      ) {
        setCurrentValues([]);
        setBusinessInfo(__assign(__assign({}, businessInfo), { locations_fetched: false }));
      } else setCurrentValues(results);
    },
    [zipCodesMap]
  );
  var getMatch = function (prefix, limit) {
    if (limit === void 0) {
      limit = 100;
    }
    if (zipCodesMap === null) return;
    var uniqueValues = new Set();
    Array.from(zipCodesMap)
      .filter(function (_a) {
        var key = _a[0];
        return key.startsWith(prefix);
      })
      .forEach(function (_a) {
        var value = _a[1];
        if (uniqueValues.size < limit) {
          uniqueValues.add(value);
        }
      });
    var arr = Array.from(uniqueValues).slice(0, limit);
    setMyOptions(arr);
  };
  useEffect(
    function () {
      getMatch(zipcode);
    },
    [zipcode]
  );
  useEffect(
    function () {
      setBusinessInfo(__assign(__assign({}, businessInfo), { physical_locations: currentValues }));
    },
    [currentValues]
  );
  return _jsx(Autocomplete, {
    autoComplete: false,
    filterOptions: function (x) {
      return x;
    },
    options: myOptions,
    multiple: true,
    freeSolo: true,
    className: 'w-full',
    value: currentValues,
    onChange: function (event, newValue) {
      setCurrentValues(newValue);
    },
    inputValue: zipcode,
    onInputChange: function (event, newInputValue) {
      setZipCode(newInputValue);
    },
    renderTags: function (tags, getTagProps) {
      return tags.map(function (item, index) {
        var tagProps = __rest(getTagProps({ index: index }), []);
        return _jsx(
          Chip,
          {
            variant: 'solid',
            sx: { margin: 0.5 },
            style: {
              backgroundColor: '#BCF0DA',
              color: 'black',
              borderRadius: '6px',
            },
            endDecorator: _jsx(
              ChipDelete,
              __assign(
                {
                  variant: 'plain',
                  style: {
                    backgroundColor: '#BCF0DA',
                    color: 'gray',
                  },
                },
                tagProps
              )
            ),
            children: item,
          },
          index
        );
      });
    },
    renderInput: function (params) {
      return _jsx(TextField, __assign({}, params, { label: 'Physical Locations' }));
    },
  });
};
export default ZipCodeInput;
//# sourceMappingURL=ZipCodeInput.js.map
