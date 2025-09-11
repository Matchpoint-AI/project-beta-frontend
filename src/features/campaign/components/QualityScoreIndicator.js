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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, CircularProgress, Typography, Tooltip, Collapse, IconButton, Chip, LinearProgress, Card, CardContent, } from '@mui/material';
import { TrendingUp, TrendingDown, Info, ExpandMore, ExpandLess, CheckCircle, Warning, Error as ErrorIcon, } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// Simple debounce implementation
function debounce(func, wait) {
    var timeoutId = null;
    var debounced = function () {
        var args = [];
        for (var _a = 0; _a < arguments.length; _a++) {
            args[_a] = arguments[_a];
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function () {
            func.apply(void 0, args);
            timeoutId = null;
        }, wait);
    };
    debounced.cancel = function () {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
    return debounced;
}
// Styled components for visual appeal
var QualityCard = styled(Card)(function (_a) {
    var _theme = _a.theme;
    return ({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 12,
        position: 'relative',
        overflow: 'visible',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            zIndex: -1,
        },
    });
});
var ScoreCircle = styled(Box)(function (_a) {
    var score = _a.score;
    return ({
        width: 80,
        height: 80,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "conic-gradient(\n    ".concat(getScoreColor(score), " ").concat(score * 3.6, "deg, \n    rgba(255, 255, 255, 0.2) ").concat(score * 3.6, "deg\n  )"),
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
    });
});
var MetricBar = styled(LinearProgress)(function (_a) {
    var _theme = _a.theme;
    return ({
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        '& .MuiLinearProgress-bar': {
            borderRadius: 3,
        },
    });
});
// Helper function to get color based on score
function getScoreColor(score) {
    if (score >= 80)
        return '#4caf50';
    if (score >= 60)
        return '#ff9800';
    return '#f44336';
}
function getScoreIcon(score) {
    if (score >= 80)
        return _jsx(CheckCircle, { sx: { fontSize: 16 } });
    if (score >= 60)
        return _jsx(Warning, { sx: { fontSize: 16 } });
    return _jsx(ErrorIcon, { sx: { fontSize: 16 } });
}
export var QualityScoreIndicator = function (_a) {
    var content = _a.content, _b = _a.contentType, contentType = _b === void 0 ? 'caption' : _b, brandContext = _a.brandContext, onScoreChange = _a.onScoreChange, _c = _a.minHeight, minHeight = _c === void 0 ? 120 : _c, _d = _a.showDetails, showDetails = _d === void 0 ? true : _d, _e = _a.position, position = _e === void 0 ? 'inline' : _e;
    var _f = useState(0), overallScore = _f[0], setOverallScore = _f[1];
    var _g = useState([]), metrics = _g[0], setMetrics = _g[1];
    var _h = useState(false), isCalculating = _h[0], setIsCalculating = _h[1];
    var _j = useState(false), expanded = _j[0], setExpanded = _j[1];
    var _k = useState(0), previousScore = _k[0], setPreviousScore = _k[1];
    // Analyze content quality
    var analyzeQuality = useCallback(function (text) {
        var results = [];
        // Length Check
        var lengthScore = calculateLengthScore(text, contentType);
        results.push({
            name: 'Length',
            score: lengthScore,
            weight: 0.15,
            description: 'Optimal content length for engagement',
            suggestions: getLengthSuggestions(text, contentType),
        });
        // Keyword Density
        var keywordScore = calculateKeywordScore(text, (brandContext === null || brandContext === void 0 ? void 0 : brandContext.keywords) || []);
        results.push({
            name: 'Keywords',
            score: keywordScore,
            weight: 0.2,
            description: 'Brand keyword presence',
            suggestions: getKeywordSuggestions(text, (brandContext === null || brandContext === void 0 ? void 0 : brandContext.keywords) || []),
        });
        // Readability
        var readabilityScore = calculateReadabilityScore(text);
        results.push({
            name: 'Readability',
            score: readabilityScore,
            weight: 0.25,
            description: 'Easy to read and understand',
            suggestions: getReadabilitySuggestions(text),
        });
        // Engagement Potential
        var engagementScore = calculateEngagementScore(text);
        results.push({
            name: 'Engagement',
            score: engagementScore,
            weight: 0.2,
            description: 'Likely to drive interaction',
            suggestions: getEngagementSuggestions(text),
        });
        // Tone Alignment
        var toneScore = calculateToneScore(text, (brandContext === null || brandContext === void 0 ? void 0 : brandContext.tone) || 'neutral');
        results.push({
            name: 'Tone',
            score: toneScore,
            weight: 0.2,
            description: 'Matches brand voice',
            suggestions: getToneSuggestions(text, (brandContext === null || brandContext === void 0 ? void 0 : brandContext.tone) || 'neutral'),
        });
        return results;
    }, [contentType, brandContext]);
    // Debounced quality calculation
    var debouncedCalculate = useMemo(function () {
        return debounce(function (text) {
            setIsCalculating(true);
            // Simulate async calculation
            setTimeout(function () {
                var newMetrics = analyzeQuality(text);
                var newScore = Math.round(newMetrics.reduce(function (acc, metric) { return acc + metric.score * metric.weight; }, 0));
                setPreviousScore(overallScore);
                setOverallScore(newScore);
                setMetrics(newMetrics);
                setIsCalculating(false);
                if (onScoreChange) {
                    onScoreChange(newScore, newMetrics);
                }
            }, 300);
        }, 500);
    }, [analyzeQuality, onScoreChange, overallScore]);
    // Calculate quality score when content changes
    useEffect(function () {
        if (content && content.length > 0) {
            debouncedCalculate(content);
        }
        else {
            setOverallScore(0);
            setMetrics([]);
        }
    }, [content, debouncedCalculate]);
    // Score trend indicator
    var scoreTrend = overallScore > previousScore ? 'up' : overallScore < previousScore ? 'down' : 'stable';
    if (!content || content.length === 0) {
        return null;
    }
    var FloatingWrapper = position === 'floating' ? Box : React.Fragment;
    var floatingProps = position === 'floating'
        ? {
            sx: {
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
                maxWidth: 320,
            },
        }
        : {};
    return (_jsx(FloatingWrapper, __assign({}, floatingProps, { children: _jsx(QualityCard, { sx: { minHeight: minHeight, transition: 'all 0.3s ease' }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, children: [_jsxs(Box, { display: "flex", alignItems: "center", gap: 2, children: [_jsx(ScoreCircle, { score: overallScore, children: _jsx(Typography, { variant: "h5", sx: {
                                                position: 'relative',
                                                zIndex: 1,
                                                fontWeight: 'bold',
                                                color: 'white',
                                            }, children: isCalculating ? (_jsx(CircularProgress, { size: 24, sx: { color: 'white' } })) : (overallScore) }) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: { opacity: 0.9 }, children: "Quality Score" }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 0.5, children: [_jsx(Chip, { size: "small", icon: getScoreIcon(overallScore), label: overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work', sx: {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                            color: 'white',
                                                            '& .MuiChip-icon': { color: 'white' },
                                                        } }), scoreTrend !== 'stable' && (_jsx(Box, { display: "flex", alignItems: "center", children: scoreTrend === 'up' ? (_jsx(TrendingUp, { sx: { fontSize: 16, color: '#4caf50' } })) : (_jsx(TrendingDown, { sx: { fontSize: 16, color: '#f44336' } })) }))] })] })] }), showDetails && (_jsx(IconButton, { size: "small", onClick: function () { return setExpanded(!expanded); }, sx: { color: 'white' }, children: expanded ? _jsx(ExpandLess, {}) : _jsx(ExpandMore, {}) }))] }), _jsx(Collapse, { in: expanded || !showDetails, children: _jsx(Box, { sx: { mt: 2 }, children: metrics.map(function (metric, _index) { return (_jsxs(Box, { sx: { mb: 1.5 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, children: [_jsx(Typography, { variant: "caption", sx: { opacity: 0.9 }, children: metric.name }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 0.5, children: [_jsxs(Typography, { variant: "caption", fontWeight: "bold", children: [metric.score, "%"] }), _jsx(Tooltip, { title: _jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: metric.description }), metric.suggestions && metric.suggestions.length > 0 && (_jsx(Box, { mt: 1, children: metric.suggestions.map(function (suggestion, _i) { return (_jsxs(Typography, { variant: "caption", display: "block", children: ["\u2022 ", suggestion] }, _i)); }) }))] }), children: _jsx(Info, { sx: { fontSize: 14, opacity: 0.7 } }) })] })] }), _jsx(MetricBar, { variant: "determinate", value: metric.score, sx: {
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getScoreColor(metric.score),
                                            },
                                        } })] }, metric.name)); }) }) })] }) }) })));
};
// Helper functions for quality calculations
function calculateLengthScore(text, type) {
    var length = text.length;
    var optimalRanges = {
        caption: { min: 100, max: 300 },
        prompt: { min: 50, max: 150 },
        description: { min: 150, max: 500 },
    };
    var range = optimalRanges[type] || optimalRanges.caption;
    if (length < range.min) {
        return Math.max(0, (length / range.min) * 80);
    }
    else if (length > range.max) {
        return Math.max(0, 100 - ((length - range.max) / range.max) * 50);
    }
    return 90 + Math.random() * 10;
}
function calculateKeywordScore(text, keywords) {
    if (!keywords || keywords.length === 0)
        return 75;
    var lowerText = text.toLowerCase();
    var foundKeywords = keywords.filter(function (kw) { return lowerText.includes(kw.toLowerCase()); });
    var score = (foundKeywords.length / keywords.length) * 100;
    return Math.min(100, Math.max(0, score));
}
function calculateReadabilityScore(text) {
    var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
    var words = text.split(/\s+/).filter(function (w) { return w.length > 0; });
    var avgWordsPerSentence = words.length / (sentences.length || 1);
    // Simple readability scoring
    if (avgWordsPerSentence < 10)
        return 95;
    if (avgWordsPerSentence < 15)
        return 85;
    if (avgWordsPerSentence < 20)
        return 70;
    if (avgWordsPerSentence < 25)
        return 50;
    return 30;
}
function calculateEngagementScore(text) {
    var score = 70; // Base score
    // Check for engagement elements
    if (text.includes('?'))
        score += 10; // Questions
    if (text.match(/!+/))
        score += 5; // Excitement
    if (text.match(/#\w+/))
        score += 5; // Hashtags
    if (text.match(/@\w+/))
        score += 5; // Mentions
    if (text.match(/https?:\/\//))
        score += 5; // Links
    // Check for call-to-actions
    var ctaWords = ['click', 'visit', 'shop', 'discover', 'learn', 'join', 'get', 'try'];
    var lowerText = text.toLowerCase();
    if (ctaWords.some(function (word) { return lowerText.includes(word); }))
        score += 10;
    return Math.min(100, score);
}
function calculateToneScore(text, targetTone) {
    // Simplified tone analysis
    var toneIndicators = {
        professional: ['professional', 'expertise', 'quality', 'service', 'solution'],
        casual: ['hey', 'awesome', 'cool', 'fun', 'love'],
        friendly: ['thank', 'please', 'happy', 'glad', 'welcome'],
        urgent: ['now', 'today', 'limited', 'hurry', 'fast'],
        neutral: [],
    };
    var indicators = toneIndicators[targetTone] || toneIndicators.neutral;
    if (indicators.length === 0)
        return 80;
    var lowerText = text.toLowerCase();
    var matches = indicators.filter(function (word) { return lowerText.includes(word); });
    return 70 + matches.length * 10;
}
// Suggestion functions
function getLengthSuggestions(text, type) {
    var length = text.length;
    var suggestions = [];
    var optimalRanges = {
        caption: { min: 100, max: 300 },
        prompt: { min: 50, max: 150 },
        description: { min: 150, max: 500 },
    };
    var range = optimalRanges[type] || optimalRanges.caption;
    if (length < range.min) {
        suggestions.push("Add ".concat(range.min - length, " more characters for optimal length"));
    }
    else if (length > range.max) {
        suggestions.push("Consider reducing by ".concat(length - range.max, " characters"));
    }
    return suggestions;
}
function getKeywordSuggestions(text, keywords) {
    if (!keywords || keywords.length === 0)
        return [];
    var lowerText = text.toLowerCase();
    var missingKeywords = keywords.filter(function (kw) { return !lowerText.includes(kw.toLowerCase()); });
    if (missingKeywords.length > 0) {
        return ["Consider including: ".concat(missingKeywords.slice(0, 3).join(', '))];
    }
    return [];
}
function getReadabilitySuggestions(text) {
    var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
    var words = text.split(/\s+/).filter(function (w) { return w.length > 0; });
    var avgWordsPerSentence = words.length / (sentences.length || 1);
    if (avgWordsPerSentence > 20) {
        return ['Break up long sentences for better readability'];
    }
    if (avgWordsPerSentence < 8) {
        return ['Combine short sentences for better flow'];
    }
    return [];
}
function getEngagementSuggestions(text) {
    var suggestions = [];
    if (!text.includes('?')) {
        suggestions.push('Add a question to encourage engagement');
    }
    if (!text.match(/#\w+/)) {
        suggestions.push('Include relevant hashtags');
    }
    var ctaWords = ['click', 'visit', 'shop', 'discover', 'learn', 'join'];
    var lowerText = text.toLowerCase();
    if (!ctaWords.some(function (word) { return lowerText.includes(word); })) {
        suggestions.push('Add a clear call-to-action');
    }
    return suggestions.slice(0, 2);
}
function getToneSuggestions(text, targetTone) {
    var suggestions = [];
    var toneGuides = {
        professional: 'Use more formal language and industry terms',
        casual: 'Make it more conversational and relaxed',
        friendly: 'Add warmth with friendly greetings or thanks',
        urgent: 'Create urgency with time-sensitive language',
    };
    if (toneGuides[targetTone]) {
        suggestions.push(toneGuides[targetTone]);
    }
    return suggestions;
}
export default QualityScoreIndicator;
//# sourceMappingURL=QualityScoreIndicator.js.map