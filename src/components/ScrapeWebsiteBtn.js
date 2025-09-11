import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useContext, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { BrandContext } from '../features/brand/context/BrandContext';
import { SparklesMessage } from '../shared/components/ui/SparklesMessage';
export function ScrapeWebsiteBtn(_a) {
  var handleSubmit = _a.handleSubmit,
    nameError = _a.nameError,
    websiteError = _a.websiteError,
    progressDescription = _a.progressDescription,
    scrapingError = _a.scrapingError;
  var _b = useState(true),
    showBtn = _b[0],
    setShowBtn = _b[1];
  var _c = useState(false),
    scraping = _c[0],
    setScraping = _c[1];
  var businessInfo = useContext(BrandContext).businessInfo;
  var handleClick = function () {
    setScraping(true);
    handleSubmit();
  };
  useEffect(
    function () {
      if (nameError.error || websiteError.error || scrapingError) setScraping(false);
    },
    [nameError, websiteError, scrapingError]
  );
  useEffect(
    function () {
      if (businessInfo.industry || businessInfo.vertical || businessInfo.physical_locations)
        setShowBtn(false);
    },
    [businessInfo]
  );
  return _jsxs(_Fragment, {
    children: [
      showBtn &&
        _jsx('div', {
          className: 'flex flex-col gap-2',
          children: _jsx('button', {
            type: 'button',
            className:
              'bg-[#5145CD] hover:bg-[#6875F5] text-white text-sm h-10 w-[100px] rounded-lg font-bold flex items-center disabled:cursor-not-allowed justify-center',
            onClick: handleClick,
            disabled: scraping,
            children: scraping
              ? _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })
              : 'Start',
          }),
        }),
      progressDescription !== '' &&
        _jsx(SparklesMessage, {
          loading: true,
          children: 'Hold tight. Matchpoint is analyzing your business',
        }),
    ],
  });
}
//# sourceMappingURL=ScrapeWebsiteBtn.js.map
