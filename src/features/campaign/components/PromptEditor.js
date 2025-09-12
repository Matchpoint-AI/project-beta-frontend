import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import ResetPromptBtn from './ResetPromptBtn';
import Dropdown from '../../../shared/components/ui/Dropdown';
import { useAuth } from '../../../features/auth/context/AuthContext';
import SavePromptBtn from './SavePromptBtn';
export default function PromptEditor(_a) {
    var _b;
    var promptsArr = _a.promptsArr, placeholders = _a.placeholders, target = _a.target, switchPrompts = _a.switchPrompts, addPrompts = _a.addPrompts;
    var promptRef = useRef(null);
    var profile = useAuth().profile;
    var _c = useState(''), error = _c[0], setError = _c[1];
    var _d = useState(''), prompt = _d[0], setPrompt = _d[1];
    var _e = useState("".concat(promptsArr.length)), version = _e[0], setVersion = _e[1];
    var addPlaceholder = function (placeholder) {
        var _a;
        if (!prompt.includes("{".concat(placeholder, "}"))) {
            setPrompt(function (old) {
                return "".concat(old.trim(), " {").concat(placeholder, "} ");
            });
        }
        (_a = promptRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var changeHandler = function (e) {
        setPrompt(e.target.value);
        setError('');
    };
    var onVersionSelect = function (_, i) {
        setVersion("".concat(i + 1));
        setPrompt(promptsArr[i].prompt);
    };
    var updatePromptVersion = function (version, target) {
        switchPrompts(version, target);
        setVersion("".concat(promptsArr.length));
    };
    useEffect(function () {
        setPrompt(promptsArr.at(-1).prompt);
        setVersion("".concat(promptsArr.length));
    }, [promptsArr]);
    return (_jsx("form", { children: _jsxs("div", { className: "flex flex-col gap-3 w-full", children: [_jsx("label", { className: "font-medium text-lg capitalize", children: target === 'scrape_website' ? 'Scrape brand website' : 'Content generation' }), _jsxs("div", { className: "flex flex-wrap", children: [_jsx("div", { className: "flex gap-1", children: placeholders.map(function (ph) { return (_jsx("button", { onClick: function () { return addPlaceholder(ph); }, type: "button", className: "bg-white py-1 px-2 text-[#03543F] text-sm rounded-md", children: "{".concat(ph, "}") }, ph)); }) }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsx("span", { children: "Version" }), _jsx(Dropdown, { currentValue: version, options: Array.from({ length: promptsArr.length }, function (_, i) { return String(i + 1); }), onUpdateContext: onVersionSelect })] })] }), _jsx("textarea", { ref: promptRef, value: prompt, onChange: changeHandler, className: "w-full h-[200px] outline-none p-2 resize-none rounded-sm whitespace-pre-wrap" }), error !== '' && _jsx("p", { className: "text-sm text-[#F05252] font-medium", children: error }), _jsxs("div", { className: "flex gap-3 ", children: [_jsx(SavePromptBtn, { prompt: prompt, setErrorMsg: setError, target: target, addPrompts: addPrompts }), _jsx(ResetPromptBtn, { version: Number(version), token: (_b = profile === null || profile === void 0 ? void 0 : profile.token) !== null && _b !== void 0 ? _b : '', target: target, switchPrompts: updatePromptVersion })] })] }) }));
}
//# sourceMappingURL=PromptEditor.js.map