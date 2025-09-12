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
export var capitalizeFirstLetterOfEachWord = function (str) {
    if (str === undefined)
        return str;
    return str
        .split(' ')
        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); })
        .join(' ');
};
export var structureData = function (data) {
    // Transform the object into an array of weeks
    return Object.keys(data)
        .sort()
        .map(function (weekKey) {
        var weekData = data[weekKey];
        // Transform the week object into an ordered array of days
        return Object.keys(weekData)
            .sort(function (a, b) {
            // Sorting days in numerical order (day_1, day_2, ...)
            return parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]);
        })
            .map(function (dayKey, dayIndex) {
            var dayData = weekData[dayKey];
            var approved = dayData.approved || false;
            // Transform the posts within each day into an ordered array
            var posts = Object.keys(dayData)
                .filter(function (postKey) { return postKey.startsWith('post_'); })
                .sort(function (a, b) {
                // Sorting posts in numerical order (post_1, post_2, ...)
                return parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]);
            })
                .map(function (postKey, postIndex) { return (__assign(__assign({}, dayData[postKey]), { postIndex: postIndex + 1, approved: dayData[postKey].approved || false, posted: dayData[postKey].posted || false })); });
            return {
                durationNum: dayData.durationNum || 0,
                start_date: dayData.start_date || '',
                approved: approved,
                posts: posts,
                dayIndex: dayIndex + 1, // Add day index (1-based)
            };
        });
    });
};
//# sourceMappingURL=formatters.js.map