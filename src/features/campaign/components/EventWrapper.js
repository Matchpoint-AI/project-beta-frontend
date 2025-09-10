import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
// import { PiDownloadBold } from "react-icons/pi";
import { GoClock } from 'react-icons/go';
import { FaCheckCircle } from 'react-icons/fa';
var EventWrapper = function (props) {
  var _a = useState(''),
    status = _a[0],
    setStatus = _a[1];
  var _b = useState(''),
    day = _b[0],
    setDay = _b[1];
  var _c = useState([]),
    posts = _c[0],
    setPosts = _c[1];
  useEffect(function () {
    var event = props === null || props === void 0 ? void 0 : props.event;
    console.log('event === ', event);
    setDay(event === null || event === void 0 ? void 0 : event.title);
    setStatus(event === null || event === void 0 ? void 0 : event.status);
    setPosts(event === null || event === void 0 ? void 0 : event.posts);
  }, []);
  return _jsx(_Fragment, {
    children:
      status === 'approved'
        ? _jsx('div', {
            className:
              ' w-full h-full rounded-md mx-auto gap-1 flex flex-col justify-center items-center',
            children: posts.map(function (post, index) {
              return _jsxs(
                'div',
                {
                  className:
                    'flex flex-row justify-start items-center gap-3 w-[60%] h-fit rounded-md p-1 px-2 '.concat(
                      (post === null || post === void 0 ? void 0 : post.approved)
                        ? 'bg-[#DEF7EC]'
                        : 'bg-[#FDF6B2]'
                    ),
                  children: [
                    post.approved
                      ? _jsx(FaCheckCircle, { className: 'text-[#0E9F6E]' })
                      : _jsx(GoClock, { className: 'text-[#8E4B10]' }),
                    _jsxs('h2', {
                      className: ''.concat(
                        post.approved ? 'text-[#1F2937]' : 'text-[#8E4B10]',
                        ' font-medium text-xs '
                      ),
                      children: [post.timing, ' Post'],
                    }),
                  ],
                },
                index
              );
            }),
          })
        : _jsxs('div', {
            className:
              ' w-[80%] h-fit border-[1px] p-3 border-gray-200 rounded-md mx-auto gap-2 flex flex-col justify-center items-center',
            children: [
              status === 'review' &&
                _jsxs(_Fragment, {
                  children: [
                    _jsx('h1', { className: 'font-semibold text-xs text-gray-900', children: day }),
                    _jsxs('div', {
                      className:
                        'bg-yellow-100 font-medium rounded-md flex flex-row justify-center items-center gap-1 p-1 px-2',
                      children: [
                        _jsx(GoClock, { className: 'text-yellow-800' }),
                        _jsx('h2', {
                          className: 'font-medium text-xs text-yellow-800',
                          children: 'Ready for Review',
                        }),
                      ],
                    }),
                  ],
                }),
              status === 'generate' &&
                _jsxs(_Fragment, {
                  children: [
                    _jsx('h1', { className: 'font-semibold text-xs text-gray-900', children: day }),
                    _jsxs('div', {
                      className:
                        'bg-red-100 rounded-md font-medium flex flex-row justify-center items-center gap-1 p-1 px-2',
                      children: [
                        _jsx('img', { className: 'text-[#8E4B10]', src: '/ai.svg' }),
                        _jsx('h2', {
                          className: 'font-medium text-xs text-red-800',
                          children: 'Generating...',
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
  });
  // <div className=" w-[95%] h-[85px] border-[1px] border-gray-200 rounded-md mx-auto bg-red-600 gap-2 flex flex-col justify-center items-center">
  //   <h1 className="font-semibold text-xs text-gray-900">{day}</h1>
  //   {status === "approved" && (
  //     <>
  //       <div className="bg-green-100 rounded-md p-1 px-2">
  //         <h2 className="font-medium text-xs text-green-800">Approved</h2>
  //       </div>
  //       <div
  //         onClick={DownloadContent}
  //         className="flex flex-row gap-1 hover:cursor-pointer"
  //       >
  //         <PiDownloadBold />
  //         <h2 className="font-medium text-xs text-gray-900">Download</h2>
  //       </div>
  //     </>
  //   )}
  //   {status === "review" && (
  //     <div className="bg-yellow-100 rounded-md p-1 px-2">
  //       <h2 className="font-medium text-xs text-yellow-800">
  //         Ready for Review
  //       </h2>
  //     </div>
  //   )}
  //   {status === "generate" && (
  //     <div className="bg-red-100 rounded-md p-1 px-2">
  //       <h2 className="font-medium text-xs text-red-800">Generating...</h2>
  //     </div>
  //   )}
  // </div>
};
export default EventWrapper;
//# sourceMappingURL=EventWrapper.js.map
