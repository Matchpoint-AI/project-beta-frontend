import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CampaignContext } from "../context/CampaignContext";
import { signOut } from "firebase/auth";
import { useAuthentication } from "../firebase";
import { TbLogout2 } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { TbPhoto } from "react-icons/tb";
import { PiUsersBold } from "react-icons/pi";
import { TbSparkles } from "react-icons/tb";
import Cookies from "universal-cookie";
import { useAuth } from "../context/AuthContext";
import posthog from "../helpers/posthog";
import handleNavigate from "../helpers/handleNavigate";

export default function SideNavBar({
  className,
  phone,
  style,
}: {
  className?: string
  phone: boolean
  style?: React.CSSProperties
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { setCampaignInfo } = useContext(CampaignContext)
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { auth } = useAuthentication()
  const { pathname } = useLocation()
  const cookies = new Cookies()

  const handleNewCampaign = () => {
    setCampaignInfo({
      currentStep: 1,
    })
    handleNavigate(profile.id, "/campaign", navigate)
  }

  const handleLogout = () => {
    const currentPath = window.location.pathname
    console.log("currentPath === ", currentPath)
    signOut(auth)
      .then(() => {
        cookies.remove("access_token", {
          domain: window.location.hostname,
        })
        if (posthog.__loaded) {
          posthog.capture("User Logged Out", {
            distinct_id: profile.id,
          })
        }
        navigate("/login")
      })
      .catch((err) => {
        console.log("problem while signing out: ", err.message)
      })
  }

  // Tooltip component
  const Tooltip = ({ label, show }: { label: string; show: boolean }) => {
    if (!show) return null

    return (
      <div className="absolute left-[105%] ml-3 top-1/2 transform -translate-y-1/2">
        {/* Triangle pointer */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-white"></div>
        </div>      {/* Tooltip content */}
        <div className="bg-white  px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm text-indigo-800 font-bold border border-gray-200">
          {label}
        </div>
      </div>
    )
  }

  return (
    <nav className={`flex flex-col justify-between items-center h-screen  py-5  ${className}`} style={style}>
      {!phone && (
        <Link to="/">
          <img src="/logo_simple.svg" alt="logo" width={40} height={40} />
        </Link>
      )}

      <div className="flex flex-col gap-10 flex-1 relative  w-full justify-center items-center">
        {/* Add Campaign Button */}
        <div className="relative w-full flex justify-center items-center"
          onMouseEnter={() => setHoveredItem("add")} onMouseLeave={() => setHoveredItem(null)}>
          <img
            onClick={handleNewCampaign}
            src="/add_button.svg"
            alt="add"
            width={25}
            height={25}
            className="hover:cursor-pointer"
          />
          <Tooltip label="New Campaign" show={hoveredItem === "add"} />
        </div>

        {/* Dashboard Button */}
        <div
          className="relative w-full flex justify-center items-center"
          onMouseEnter={() => setHoveredItem("dashboard")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <button className="" type="button" onClick={() => handleNavigate(profile.id, "/dashboard", navigate)}>
            <Link to="/dashboard">
              <TbPhoto
                size={30}
                color={
                  pathname === "/" || pathname === "/dashboard" || pathname.includes("/campaign/content")
                    ? "#5145CD"
                    : "#111928"
                }
              />
            </Link>
          </button>
          <Tooltip label="Dashboard" show={hoveredItem === "dashboard"} />
        </div>

        {/* Onboard Button */}
        <div
          className="relative w-full flex justify-center items-center"
          onMouseEnter={() => setHoveredItem("onboard")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <button type="button" onClick={() => handleNavigate(profile.id, "/onboard", navigate)}>
            <Link to="/onboard">
              <TbBriefcase size={30} color={pathname === "/onboard" ? "#5145CD" : "#111928"} />
            </Link>
          </button>
          <Tooltip label="Business Onboarding" show={hoveredItem === "onboard"} />
        </div>

        {/* Admin Links */}
        {profile && profile.role === "ADMIN" && (
          <>
            {/* Admin Prompts */}
            <div
              className="relative w-full flex justify-center items-center"
              onMouseEnter={() => setHoveredItem("prompts")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/admin/prompts">
                <TbSparkles size={30} color={pathname === "/admin/prompts" ? "#5145CD" : "#111928"} />
              </Link>
              <Tooltip label="Admin Prompts" show={hoveredItem === "prompts"} />
            </div>

            {/* Admin Users */}
            <div
              className="relative w-full flex justify-center items-center"
              onMouseEnter={() => setHoveredItem("users")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/admin/users">
                <PiUsersBold size={30} color={pathname.includes("/admin/users") ? "#5145CD" : "#111928"} />
              </Link>
              <Tooltip label="Manage Users" show={hoveredItem === "users"} />
            </div>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div
        className="relative w-full flex justify-center items-center mb-4"
        onMouseEnter={() => setHoveredItem("logout")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <button onClick={handleLogout}>
          <TbLogout2 size={30} color="black" />
        </button>
        <Tooltip label="Logout" show={hoveredItem === "logout"} />
      </div>

      {/* Profile Link */}
      <div
        className="relative w-full flex justify-center items-center"
        onMouseEnter={() => setHoveredItem("profile")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Link to="/profile">
          <img src="/profile.svg" alt="profile" width={35} height={35} />
        </Link>
        <Tooltip label="Profile" show={hoveredItem === "profile"} />
      </div>
    </nav>
  )
}

