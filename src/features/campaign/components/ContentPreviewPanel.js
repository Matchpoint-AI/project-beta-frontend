import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Paper, Button, ButtonGroup, Chip, Grid, Zoom, CircularProgress, useTheme, alpha, } from '@mui/material';
import { MdFullscreen, MdFullscreenExit, MdViewCompact, MdViewComfy, MdPhoneIphone, MdLaptop, MdTablet, } from 'react-icons/md';
import { FaInstagram, FaFacebookF, FaTwitter, FaTiktok, FaLinkedinIn, FaPinterestP, } from 'react-icons/fa';
// import { IoMdCheckmark } from 'react-icons/io';
import { BiRefresh } from 'react-icons/bi';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
var platformStyles = {
    instagram: {
        icon: FaInstagram,
        color: '#E4405F',
        maxChars: 2200,
        name: 'Instagram',
    },
    facebook: {
        icon: FaFacebookF,
        color: '#1877F2',
        maxChars: 63206,
        name: 'Facebook',
    },
    twitter: {
        icon: FaTwitter,
        color: '#1DA1F2',
        maxChars: 280,
        name: 'Twitter',
    },
    tiktok: {
        icon: FaTiktok,
        color: '#000000',
        maxChars: 2200,
        name: 'TikTok',
    },
    linkedin: {
        icon: FaLinkedinIn,
        color: '#0A66C2',
        maxChars: 3000,
        name: 'LinkedIn',
    },
    pinterest: {
        icon: FaPinterestP,
        color: '#E60023',
        maxChars: 500,
        name: 'Pinterest',
    },
};
var deviceSizes = {
    mobile: { width: 375, height: 667, label: 'Mobile' },
    tablet: { width: 768, height: 1024, label: 'Tablet' },
    desktop: { width: 1440, height: 900, label: 'Desktop' },
};
var ContentPreviewPanel = function (_a) {
    var content = _a.content, _b = _a.platform, platform = _b === void 0 ? 'instagram' : _b, _c = _a.brandName, brandName = _c === void 0 ? 'Your Brand' : _c, profileImage = _a.profileImage, _d = _a.isLoading, isLoading = _d === void 0 ? false : _d, onRefresh = _a.onRefresh, onEdit = _a.onEdit, _e = _a.qualityScore, qualityScore = _e === void 0 ? 0 : _e, engagementPrediction = _a.engagementPrediction;
    var theme = useTheme();
    var _f = useState('split'), viewMode = _f[0], setViewMode = _f[1];
    var _g = useState(platform), selectedPlatform = _g[0], setSelectedPlatform = _g[1];
    var _h = useState('mobile'), deviceView = _h[0], setDeviceView = _h[1];
    var _j = useState(false), isFullscreen = _j[0], setIsFullscreen = _j[1];
    var _k = useState(0), selectedImageIndex = _k[0], setSelectedImageIndex = _k[1];
    var containerRef = useRef(null);
    var _PlatformIcon = platformStyles[selectedPlatform].icon;
    var platformColor = platformStyles[selectedPlatform].color;
    var maxChars = platformStyles[selectedPlatform].maxChars;
    var imageUrls = Array.isArray(content.imageUrl)
        ? content.imageUrl
        : content.imageUrl
            ? [content.imageUrl]
            : [];
    var currentImage = imageUrls[selectedImageIndex] || '';
    var formatNumber = function (num) {
        if (num >= 1000000)
            return "".concat((num / 1000000).toFixed(1), "M");
        if (num >= 1000)
            return "".concat((num / 1000).toFixed(1), "K");
        return num.toString();
    };
    var getQualityColor = function (score) {
        if (score >= 80)
            return theme.palette.success.main;
        if (score >= 60)
            return theme.palette.warning.main;
        return theme.palette.error.main;
    };
    var handleFullscreen = function () {
        var _a, _b, _c;
        if (!isFullscreen && containerRef.current) {
            (_b = (_a = containerRef.current).requestFullscreen) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        else if (document.fullscreenElement) {
            (_c = document.exitFullscreen) === null || _c === void 0 ? void 0 : _c.call(document);
        }
        setIsFullscreen(!isFullscreen);
    };
    useEffect(function () {
        var handleFullscreenChange = function () {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return function () { return document.removeEventListener('fullscreenchange', handleFullscreenChange); };
    }, []);
    var renderEditPanel = function () { return (_jsxs(Box, { sx: { p: 2, height: '100%', overflowY: 'auto' }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(AutoAwesomeOutlinedIcon, { sx: { color: platformColor } }), "Content Editor"] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: ["Caption (", content.text.length, "/", maxChars, ")"] }), _jsx(Paper, { variant: "outlined", sx: {
                            p: 2,
                            minHeight: 120,
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                            cursor: onEdit ? 'pointer' : 'default',
                            '&:hover': onEdit ? { bgcolor: alpha(theme.palette.primary.main, 0.05) } : {},
                        }, onClick: onEdit, children: _jsx(Typography, { variant: "body2", sx: { whiteSpace: 'pre-wrap' }, children: content.text }) })] }), content.hashtags && content.hashtags.length > 0 && (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Hashtags" }), _jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: content.hashtags.map(function (tag, idx) { return (_jsx(Chip, { label: tag, size: "small", sx: { bgcolor: alpha(platformColor, 0.1), color: platformColor } }, idx)); }) })] })), qualityScore > 0 && (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Quality Score" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Box, { sx: { flex: 1, position: 'relative' }, children: _jsx(Box, { sx: {
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: alpha(theme.palette.divider, 0.2),
                                        overflow: 'hidden',
                                    }, children: _jsx(Box, { sx: {
                                            height: '100%',
                                            width: "".concat(qualityScore, "%"),
                                            bgcolor: getQualityColor(qualityScore),
                                            transition: 'width 0.5s ease-in-out',
                                        } }) }) }), _jsxs(Typography, { variant: "h6", sx: { color: getQualityColor(qualityScore), fontWeight: 'bold' }, children: [qualityScore, "%"] })] })] })), engagementPrediction && (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Predicted Engagement" }), _jsxs(Grid, { container: true, spacing: 1, children: [_jsx(Grid, { item: true, xs: 4, children: _jsxs(Paper, { variant: "outlined", sx: { p: 1, textAlign: 'center' }, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: "Likes" }), _jsx(Typography, { variant: "h6", children: formatNumber(engagementPrediction.likes) })] }) }), _jsx(Grid, { item: true, xs: 4, children: _jsxs(Paper, { variant: "outlined", sx: { p: 1, textAlign: 'center' }, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: "Shares" }), _jsx(Typography, { variant: "h6", children: formatNumber(engagementPrediction.shares) })] }) }), _jsx(Grid, { item: true, xs: 4, children: _jsxs(Paper, { variant: "outlined", sx: { p: 1, textAlign: 'center' }, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: "Comments" }), _jsx(Typography, { variant: "h6", children: formatNumber(engagementPrediction.comments) })] }) })] })] })), _jsxs(Box, { sx: { display: 'flex', gap: 1, mt: 3 }, children: [onEdit && (_jsx(Button, { fullWidth: true, variant: "contained", onClick: onEdit, sx: { bgcolor: platformColor, '&:hover': { bgcolor: alpha(platformColor, 0.8) } }, children: "Edit Content" })), onRefresh && (_jsx(IconButton, { onClick: onRefresh, sx: { color: platformColor }, children: _jsx(BiRefresh, {}) }))] })] })); };
    var renderPreview = function () {
        var device = deviceSizes[deviceView];
        var scale = deviceView === 'mobile' ? 0.7 : deviceView === 'tablet' ? 0.5 : 0.4;
        return (_jsxs(Box, { sx: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: alpha(theme.palette.background.default, 0.5),
            }, children: [_jsx(Box, { sx: { p: 2, borderBottom: 1, borderColor: 'divider' }, children: _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Box, { sx: { display: 'flex', gap: 1 }, children: Object.entries(platformStyles).map(function (_a) {
                                    var key = _a[0], style = _a[1];
                                    var Icon = style.icon;
                                    return (_jsx(IconButton, { size: "small", onClick: function () { return setSelectedPlatform(key); }, sx: {
                                            color: selectedPlatform === key ? style.color : 'text.secondary',
                                            bgcolor: selectedPlatform === key ? alpha(style.color, 0.1) : 'transparent',
                                        }, children: _jsx(Icon, {}) }, key));
                                }) }), _jsxs(ButtonGroup, { size: "small", variant: "outlined", children: [_jsx(Button, { onClick: function () { return setDeviceView('mobile'); }, startIcon: _jsx(MdPhoneIphone, {}), variant: deviceView === 'mobile' ? 'contained' : 'outlined', children: "Mobile" }), _jsx(Button, { onClick: function () { return setDeviceView('tablet'); }, startIcon: _jsx(MdTablet, {}), variant: deviceView === 'tablet' ? 'contained' : 'outlined', children: "Tablet" }), _jsx(Button, { onClick: function () { return setDeviceView('desktop'); }, startIcon: _jsx(MdLaptop, {}), variant: deviceView === 'desktop' ? 'contained' : 'outlined', children: "Desktop" })] })] }) }), _jsx(Box, { sx: {
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        overflow: 'auto',
                    }, children: isLoading ? (_jsx(CircularProgress, {})) : (_jsx(Zoom, { in: true, children: _jsx(Paper, { elevation: 8, sx: {
                                width: device.width * scale,
                                height: device.height * scale,
                                overflow: 'hidden',
                                borderRadius: deviceView === 'mobile' ? 4 : 2,
                                transform: "scale(".concat(scale, ")"),
                                transformOrigin: 'center',
                                bgcolor: 'background.paper',
                            }, children: _jsxs(Box, { sx: { height: '100%', overflowY: 'auto' }, children: [_jsxs(Box, { sx: {
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                        }, children: [_jsx(Box, { sx: {
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    bgcolor: platformColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }, children: profileImage ? (_jsx("img", { src: profileImage, alt: brandName, style: { width: '100%', borderRadius: '50%' } })) : (_jsx(Typography, { variant: "caption", sx: { color: 'white', fontWeight: 'bold' }, children: brandName[0] })) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 'bold' }, children: brandName }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "2 hours ago" })] })] }), currentImage && (_jsxs(Box, { sx: { position: 'relative', bgcolor: 'black' }, children: [_jsx("img", { src: currentImage, alt: "Content preview", style: {
                                                    width: '100%',
                                                    height: 'auto',
                                                    maxHeight: device.height * scale * 0.6,
                                                    objectFit: 'contain',
                                                } }), imageUrls.length > 1 && (_jsx(Box, { sx: {
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    display: 'flex',
                                                    gap: 0.5,
                                                }, children: imageUrls.map(function (_, idx) { return (_jsx(Box, { onClick: function () { return setSelectedImageIndex(idx); }, sx: {
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: idx === selectedImageIndex ? 'white' : alpha('#fff', 0.5),
                                                        cursor: 'pointer',
                                                    } }, idx)); }) }))] })), _jsxs(Box, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { whiteSpace: 'pre-wrap', mb: 1 }, children: content.text }), content.hashtags && (_jsx(Typography, { variant: "body2", sx: { color: platformColor }, children: content.hashtags.map(function (tag) { return "#".concat(tag); }).join(' ') }))] }), _jsxs(Box, { sx: {
                                            p: 2,
                                            borderTop: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                        }, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: "Like" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Comment" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Share" })] })] }) }) })) })] }));
    };
    return (_jsx(Card, { ref: containerRef, sx: { height: isFullscreen ? '100vh' : 600, display: 'flex', flexDirection: 'column' }, children: _jsxs(CardContent, { sx: { p: 0, height: '100%', display: 'flex', flexDirection: 'column' }, children: [_jsxs(Box, { sx: {
                        px: 2,
                        py: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }, children: [_jsxs(Typography, { variant: "h6", sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(AutoAwesomeOutlinedIcon, {}), "Enhanced Content Preview"] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsxs(ButtonGroup, { size: "small", variant: "outlined", children: [_jsx(Button, { onClick: function () { return setViewMode('split'); }, startIcon: _jsx(MdViewComfy, {}), variant: viewMode === 'split' ? 'contained' : 'outlined', children: "Split View" }), _jsx(Button, { onClick: function () { return setViewMode('preview'); }, startIcon: _jsx(MdViewCompact, {}), variant: viewMode === 'preview' ? 'contained' : 'outlined', children: "Preview Only" })] }), _jsx(IconButton, { size: "small", onClick: handleFullscreen, children: isFullscreen ? _jsx(MdFullscreenExit, {}) : _jsx(MdFullscreen, {}) })] })] }), _jsx(Box, { sx: { flex: 1, display: 'flex', overflow: 'hidden' }, children: viewMode === 'split' ? (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { width: '40%', borderRight: 1, borderColor: 'divider' }, children: renderEditPanel() }), _jsx(Box, { sx: { flex: 1 }, children: renderPreview() })] })) : (renderPreview()) })] }) }));
};
export default ContentPreviewPanel;
//# sourceMappingURL=ContentPreviewPanel.js.map