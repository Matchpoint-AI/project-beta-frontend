import React from 'react';
import LandingInput from '../../shared/components/inputs/LandingInput';

const Contact = () => {
  // TODO functionality of saving data and sending email
  const userName = () => {};

  const userEmail = () => {};

  const userIndustry = () => {};

  const handleSumbit = () => {};
  return (
    <div
      id="contact"
      className="w-full px-9 py-20 lg:p-20 flex flex-col gap-14 lg:gap-0 lg:flex-row lg:justify-between items-start lg:items-center bg-pink-50"
    >
      <div className="w-full lg:w-[31%] h-full  gap-4  lg:gap-8 flex flex-col justify-between items-start p-0">
        <h1 className="font-medium text-3xl  lg:text-6xl lg:leading-[75px] text-[#221F28]">
          Sign Up!
        </h1>
        <h2 className="font-medium text-xl lg:text-4xl lg:leading-[45px] text-[#5B477C]">
          and we will notify you <br /> of the beta launch.
        </h2>
      </div>
      <form
        onSubmit={handleSumbit}
        className="w-full lg:w-[45%] h-full flex flex-col justify-between gap-5 items-center"
      >
        <LandingInput placeholder={'NAME'} handleChange={userName} />
        <LandingInput placeholder={'EMAIL'} handleChange={userEmail} />
        <LandingInput placeholder={'INDUSTRY'} handleChange={userIndustry} />
        <button
          className="w-44 h-12 px-5 py-3 text-white text-base font-medium leading-6 text-center rounded-lg bg-purple-700 self-end"
          type="submit"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default Contact;
