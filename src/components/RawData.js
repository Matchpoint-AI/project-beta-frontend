import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import ReactJson from 'react-json-view';
export default function RawData(_a) {
    var state = _a.state, onClose = _a.onClose, data = _a.data;
    var _b = useState(null), formattedData = _b[0], setFormattedData = _b[1];
    useEffect(function () {
        var _a, _b;
        var data_v2 = {};
        for (var week = 0; week < data.length; week++) {
            var weekKey = "week_".concat(week + 1);
            Object.assign(data_v2, (_a = {}, _a[weekKey] = {}, _a));
            for (var day = 0; day < 7; day++) {
                var dayKey = "day_".concat(day + 1);
                Object.assign(data_v2[weekKey], (_b = {}, _b[dayKey] = {}, _b));
                for (var post = 0; post < data[0][0].length; post++) {
                    var postKey = "post_".concat(post + 1);
                    data_v2[weekKey][dayKey][postKey] = data[week][day][post];
                }
            }
        }
        setFormattedData(data_v2);
    }, [data]);
    return (_jsx(_Fragment, { children: formattedData && (_jsx(Drawer, { anchor: "left", open: state, onClose: onClose, sx: { zIndex: 50, maxWidth: '900px' }, children: _jsx("div", { className: "bg-[#272822] h-full w-full relative overflow-auto", children: _jsx(ReactJson, { src: formattedData, theme: "monokai", displayDataTypes: false, style: { width: '900px', position: 'absolute top-0 left-0' } }) }) })) }));
}
//# sourceMappingURL=RawData.js.map