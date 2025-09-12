import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
var SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];
var LanguageSelector = function (_a) {
    var _b = _a.selectedLanguage, selectedLanguage = _b === void 0 ? 'en' : _b, onLanguageChange = _a.onLanguageChange, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = useState(false), isOpen = _d[0], setIsOpen = _d[1];
    var _e = useState(0), dropdownWidth = _e[0], setDropdownWidth = _e[1];
    var containerRef = useRef(null);
    var selectedLang = SUPPORTED_LANGUAGES.find(function (lang) { return lang.code === selectedLanguage; }) || SUPPORTED_LANGUAGES[0];
    useEffect(function () {
        if (containerRef.current) {
            var tempSpan_1 = document.createElement('span');
            tempSpan_1.style.font = window.getComputedStyle(containerRef.current).font;
            tempSpan_1.style.visibility = 'hidden';
            tempSpan_1.style.whiteSpace = 'nowrap';
            document.body.appendChild(tempSpan_1);
            var maxWidth_1 = 0;
            SUPPORTED_LANGUAGES.forEach(function (lang) {
                tempSpan_1.textContent = "".concat(lang.flag, " ").concat(lang.nativeName);
                maxWidth_1 = Math.max(maxWidth_1, tempSpan_1.offsetWidth);
            });
            setDropdownWidth(maxWidth_1 + 80); // Add padding for flag + chevron
            document.body.removeChild(tempSpan_1);
        }
    }, []);
    var handleLanguageSelect = function (languageCode) {
        onLanguageChange(languageCode);
        setIsOpen(false);
    };
    var handleClickOutside = function (event) {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(function () {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    return (_jsxs("div", { ref: containerRef, className: "relative inline-block text-left ".concat(className), style: { width: "".concat(dropdownWidth, "px") }, children: [_jsx("div", { className: "flex justify-between", children: _jsxs("button", { type: "button", className: "inline-flex w-full justify-between items-center rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500", id: "language-selector", "aria-haspopup": "true", "aria-expanded": isOpen, onClick: function () { return setIsOpen(!isOpen); }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: selectedLang.flag }), _jsx("span", { children: selectedLang.nativeName })] }), _jsx("svg", { className: "h-5 w-5 transform transition-transform duration-200 ".concat(isOpen ? 'rotate-180' : 'rotate-0'), xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L5.293 8.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })] }) }), isOpen && (_jsx("div", { className: "origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999] max-h-60 overflow-y-auto", style: { width: "".concat(dropdownWidth, "px") }, children: _jsx("div", { className: "py-1", role: "menu", "aria-orientation": "vertical", "aria-labelledby": "language-selector", children: SUPPORTED_LANGUAGES.map(function (language) { return (_jsxs("button", { className: "w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 ".concat(selectedLanguage === language.code ? 'bg-indigo-50 text-indigo-700' : ''), role: "menuitem", onClick: function () { return handleLanguageSelect(language.code); }, children: [_jsx("span", { className: "text-lg", children: language.flag }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: language.nativeName }), _jsx("span", { className: "text-xs text-gray-500", children: language.name })] })] }, language.code)); }) }) }))] }));
};
export default LanguageSelector;
//# sourceMappingURL=LanguageSelector.js.map