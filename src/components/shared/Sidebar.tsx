import React, { useState } from "react";
// import { Link } from "react-router-dom";
import SideNavBar from "../SideNavBar";

interface SidebarProps {
  currentStep?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep = 1 }) => {
  const [displaySidebar, setDisplaySidebar] = useState(false);
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-20 bg-white z-50 shadow-md hidden md:block ${currentStep === 6 ? "blur-md" : ""
          }`}>
        <SideNavBar phone={false} />
      </div>

      <div className="fixed top-0 left-0 w-screen h-20 md:hidden flex items-center xs:justify-center justify-between bg-white px-5 z-50">
        <img src="/logo.svg" alt="logo" />
        <SideNavBar
          className=" bg-white w-20 absolute top-0 transition-all"
          style={{ right: displaySidebar ? "0px" : "-80px" }}
          phone={true}
        />
        <button onClick={() => setDisplaySidebar((old) => !old)}>
          <img
            src="/burger.svg"
            alt="burger-menu"
            className="absolute top-1/2 right-0 mr-[26px] translate-y-[-50%]"
          />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
