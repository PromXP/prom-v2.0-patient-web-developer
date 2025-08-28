"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import axios from "axios";

import { API_URL } from "./libs/global";

import { Raleway, Inter, Poppins, ABeeZee } from "next/font/google";

import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

import MainBg from "@/app/assets/mainbg.png";
import MainsubBg from "@/app/assets/mainsubbg.png";
import Logo from "@/app/assets/logo.png";
import Profile from "@/app/assets/profile.png";
import Home1 from "@/app/Components/Home";
import Questionnaire from "./Components/Questionnaire";
import Terms from "./Components/Terms";
import Login from "./Components/Login";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add the weights you need
  variable: "--font-raleway", // optional CSS variable
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add weights as needed
  variable: "--font-inter", // optional CSS variable name
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add weights as needed
  variable: "--font-poppins", // optional CSS variable name
});
const abeezee = ABeeZee({
  subsets: ["latin"],
  weight: ["400"], // ABeeZee only supports 400 (normal) and 400 italic
  variable: "--font-abeezee", // use a matching variable name
});

export default function Home() {
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      const updateSize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateSize(); // set initial size
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
  };

  const { width, height } = useWindowSize();

  const [isOpenacc, setIsOpenacc] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const tabs = ["Dashboard"];
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullyHidden, setIsFullyHidden] = useState(true); // for hidden toggle

  const [userData, setUserData] = useState(null);
  const [patientdata, setpatientdata] = useState();
  const handleUserData = (data) => {
    setUserData(data);
    setpatientdata(data.user);
  };

  const questionnairepage = () => {
    if(activeTab === "Dashboard"){
    setActiveTab("Questionnaire"); // switch tab only when question is clicked
    sessionStorage.setItem("activetab","Questionnaire");
    }
  };

  const handleOpen = () => {
    setIsFullyHidden(false); // show it
    requestAnimationFrame(() => {
      setIsSidebarOpen(true); // trigger transition
    });
  };

  const handleClose = () => {
    setIsSidebarOpen(false); // start slide-out
  };

  const renderSelectedcomponent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Home1  questionnairepage={questionnairepage}/>;

      case "Questionnaire":
        return <Questionnaire />;

      default:
        return null;
    }
  };

  const handleTabChange = (tab) => {
    if (activeTab === "Questionnaire" && tab !== "Questionnaire") {
      // Show confirmation modal
      sessionStorage.setItem("activetab",tab);
      setNextTab(tab);
      setIsConfirmOpen(true);
    } else {
      setActiveTab(tab);
      sessionStorage.setItem("activetab",tab);
    }
  };

  const confirmNavigation = () => {
    sessionStorage.removeItem("oks_answers");
    sessionStorage.removeItem("timepopup");
    sessionStorage.removeItem("popup_answers");
    setActiveTab(nextTab);
    setIsConfirmOpen(false);
    setNextTab(null);

  };

  const cancelNavigation = () => {
    setIsConfirmOpen(false);
    setNextTab(null);
  };

  const [termsopen, setTermsopen] = useState(false);
  const [passopen, setpassopen] = useState(false);

  const [loginopen, setloginopen] = useState(true);

  useEffect(() => {
    console.log("Terms", sessionStorage.getItem("terms"));
    if (sessionStorage.getItem("terms") === 1) {
      setTermsopen(false);
    }
    
    if(sessionStorage.getItem("activetab")){
      setActiveTab(sessionStorage.getItem("activetab"));
    }

    const uhid = sessionStorage.getItem("uhid");
    const password = sessionStorage.getItem("password");

    const userin = sessionStorage.getItem("userinfo");
    if (userin) {
      const parsedUser = JSON.parse(userin); // Parse the string to an actual object
      console.log("User Info", parsedUser);
    } else {
      console.log("No user info found in sessionStorage.");
    }

    if (password === "patient@123" && sessionStorage.getItem("terms") != 1) {
      setTermsopen(true);
    }
    // If userData already exists, don't fetch again
    if (userData && userData.user) return;

    if (uhid && password) {
      setloginopen(false);
      const fetchUserData = async () => {
        try {
          const res = await axios.post(API_URL + "login", {
            identifier: uhid,
            password: password,
            role: "patient",
          });
          handleUserData(res.data); // this will trigger your other effect
        } catch (err) {
          console.error("Auto login failed:", err);
          sessionStorage.clear(); // remove bad data
        }
      };
      fetchUserData();
    }
  }, [userData]);

  return (
    <div className="relative bg-[#CFDADE] min-h-screen w-full overflow-x-hidden">
      {/* Top-left MainBg */}
      <div className="absolute top-0 left-0">
        <Image src={MainBg} alt="MainBg" className="w-[700px]" />
      </div>

      {/* Bottom-right MainsubBg */}
      <div className="absolute bottom-0 right-0">
        <Image src={MainsubBg} alt="MainsubBg" className="h-[500px]" />
      </div>

      {!loginopen ? (
        <>
          {/* Card fills full screen with padding gap */}
          <div className="w-full h-full absolute inset-0 p-2 box-border rounded-4xl ">
            <div className="w-full h-full rounded-4xl border-white border-[1px] bg-white/10 ring-1 ring-white/30 backdrop-blur-sm p-3 shadow-[0_0_0_0.5px_rgba(255,255,255,0.3)]">
              <div
                className={`w-full h-full rounded-4xl bg-white/20 backdrop-blur-sm text-white flex flex-col ${
                  width >= 1000
                    ? " overflow-y-hidden"
                    : isOpenacc
                    ? "overflow-y-hidden"
                    : "overflow-y-auto"
                }`}
              >
                {width >= 800 ? (
                  <div className={`w-full h-[10%]`}>
                    <div className="w-full h-full flex flex-row px-8">
                      <div className="w-1/5 h-full">
                        <div className="w-fit h-full flex flex-col items-center justify-between">
                          <Image
                            src={Logo}
                            alt="XoLabs"
                            className="w-16 h-10"
                          />
                          <span
                            className={`${raleway.className} text-base font-semibold text-black`}
                          >
                            Patient
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-4/5 h-full flex flex-row justify-between border-gray-300 border-b-2`}
                      >
                        <div className={`w-fit flex flex-row gap-20 h-full`}>
                          {tabs.map((tab) => (
                            <button
                              key={tab}
                              onClick={() => handleTabChange(tab)}
                              className={`relative font-semibold text-lg ${
                                raleway.className
                              } cursor-pointer ${
                                activeTab === tab
                                  ? "text-[#6599D0]"
                                  : "text-black"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        <div
                          className={`w-fit flex flex-row h-full items-center gap-4`}
                        >
                          <p
                            className={`${inter.className} font-semibold text-[#29272A]`}
                          >
                            {userData?.user?.first_name +
                              " " +
                              userData?.user?.last_name || "Patient Name"}
                          </p>

                          <Image
                            src={Profile}
                            alt="Support"
                            className="w-10 h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col">
                    {/* Top Bar with Hamburger */}
                    <div className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-300">
                      <div className="flex items-center gap-2">
                        <Image src={Logo} alt="XoLabs" className="w-16 h-10" />
                        <span
                          className={`${raleway.className} text-lg font-semibold text-black`}
                        >
                          Patient
                        </span>
                      </div>
                      <button onClick={handleOpen}>
                        <Bars3Icon className="w-7 h-7 text-black" />
                      </button>
                    </div>

                    {/* Backdrop Overlay */}
                    <div
                      className={`fixed inset-0 z-40 bg-transparent bg-opacity-40 transition-opacity duration-300 ${
                        isSidebarOpen
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Sidebar Slide-In from Right */}
                    <div
                      className={`
                    fixed top-0 -right-0 h-full w-64 bg-white z-50 shadow-lg rounded-2xl transform transition-transform duration-300
                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                    ${isFullyHidden ? "hidden" : ""}
                  `}
                      onTransitionEnd={() => {
                        if (!isSidebarOpen) {
                          setIsFullyHidden(true); // Hide after slide-out completes
                        }
                      }}
                    >
                      <div className="flex justify-between items-center px-4 py-3 border-b">
                        <h2 className="text-xl font-semibold"></h2>
                        <button onClick={handleClose}>
                          <XMarkIcon className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                      <div className="w-full flex flex-row items-center justify-center gap-6 py-4">
                        <Image
                          src={Profile}
                          alt="Support"
                          className="w-10 h-10"
                        />
                        <p className="font-semibold text-[#29272A]">
                          {userData?.user?.first_name +
                            " " +
                            userData?.user?.last_name || "Patient Name"}
                        </p>
                      </div>
                      <nav className="p-4 space-y-4">
                        {tabs.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`relative font-semibold text-lg ${
                              raleway.className
                            } cursor-pointer ${
                              activeTab === tab
                                ? "text-[#6599D0]"
                                : "text-black"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}
                <div className={`w-full h-[90%]`}>
                  {renderSelectedcomponent()}
                </div>
              </div>
            </div>
          </div>

          {isConfirmOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={cancelNavigation} // close modal on outside click
            >
              <div
                className="bg-white rounded-xl p-6 max-w-sm w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // prevent close on modal content click
              >
                <h2
                  className={`text-xl font-bold mb-4 text-black ${poppins.className}`}
                >
                  Confirm Navigation
                </h2>
                <p
                  className={`mb-6 font-normal text-black text-center ${poppins.className}`}
                >
                  Are you sure you want to leave the Questionnaire? Your
                  responses will be lost.
                </p>
                <div
                  className={`flex justify-end gap-4 ${poppins.className} font-semibold`}
                >
                  <button
                    className="px-4 py-2 rounded bg-gray-300 text-white hover:bg-gray-400 cursor-pointer"
                    onClick={cancelNavigation}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-[#4EADA7] text-white hover:bg-[#3b8f8b] cursor-pointer"
                    onClick={confirmNavigation}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          {termsopen && (
            <Terms
              isTermsopen={termsopen}
              isTermsclose={() => {
                setTermsopen(false);
                setpassopen(true);
              }}
            />
          )}
        </>
      ) : (
        <Login
          isTermsopen={loginopen}
          isTermsclose={() => {
            setloginopen(false);
            setTermsopen(true);
          }}
          userDatasend={handleUserData}
        />
      )}
    </div>
  );
}
