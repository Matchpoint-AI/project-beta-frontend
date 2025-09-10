import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LandingInput from '../shared/Inputs/LandingInput';
var Contact = function () {
  // TODO functionality of saving data and sending email
  var userName = function () {
    console.log('saving user name');
  };
  var userEmail = function () {
    console.log('saving user email');
  };
  var userIndustry = function () {
    console.log('saving user industry');
  };
  var handleSumbit = function () {
    console.log('handle submit');
  };
  return _jsxs('div', {
    id: 'contact',
    className:
      'w-full px-9 py-20 lg:p-20 flex flex-col gap-14 lg:gap-0 lg:flex-row lg:justify-between items-start lg:items-center bg-pink-50',
    children: [
      _jsxs('div', {
        className:
          'w-full lg:w-[31%] h-full  gap-4  lg:gap-8 flex flex-col justify-between items-start p-0',
        children: [
          _jsx('h1', {
            className: 'font-medium text-3xl  lg:text-6xl lg:leading-[75px] text-[#221F28]',
            children: 'Sign Up!',
          }),
          _jsxs('h2', {
            className: 'font-medium text-xl lg:text-4xl lg:leading-[45px] text-[#5B477C]',
            children: ['and we will notify you ', _jsx('br', {}), ' of the beta launch.'],
          }),
        ],
      }),
      _jsxs('form', {
        onSubmit: handleSumbit,
        className: 'w-full lg:w-[45%] h-full flex flex-col justify-between gap-5 items-center',
        children: [
          _jsx(LandingInput, { placeholder: 'NAME', handleChange: userName }),
          _jsx(LandingInput, { placeholder: 'EMAIL', handleChange: userEmail }),
          _jsx(LandingInput, { placeholder: 'INDUSTRY', handleChange: userIndustry }),
          _jsx('button', {
            className:
              'w-44 h-12 px-5 py-3 text-white text-base font-medium leading-6 text-center rounded-lg bg-purple-700 self-end',
            type: 'submit',
            children: 'SUBMIT',
          }),
        ],
      }),
    ],
  });
};
export default Contact;
//# sourceMappingURL=Contact.js.map
