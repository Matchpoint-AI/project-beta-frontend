// Words to remove from chip labels
// const wordsToRemove = [
//    "To",
//    "on",
//    "and",
//    "the",
//    "in",
//    "with",
//    "of",
//    "by",
//    "for",
//    "particularly",
//    "after",
//    "beyond",
//    "to",
//    "for",
//    "themselves",
// ];
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
// Convert brand attributes to chips array
var convertToChipsArray = function (attribute) {
  if (typeof attribute[0] === 'object') {
    // Ensure existing chips have IDs
    return attribute.map(function (chip, index) {
      var _a;
      return __assign(__assign({}, chip), {
        id: (_a = chip.id) !== null && _a !== void 0 ? _a : index,
      });
    });
  }
  return attribute === null || attribute === void 0
    ? void 0
    : attribute
        .filter(function (v) {
          return !!v && typeof v === 'string' && v.trim() !== '';
        })
        .map(function (value, index) {
          return {
            id: index,
            label: value,
            selected: true,
          };
        });
};
export default convertToChipsArray;
//# sourceMappingURL=convertToChips.js.map
