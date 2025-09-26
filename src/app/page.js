"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import axios from "axios";

import { API_URL } from "./libs/global";

import { Raleway, Inter, Poppins, ABeeZee, Roboto } from "next/font/google";

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
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/16/solid";

import MainBg from "@/app/assets/mainbg.png";
import MainsubBg from "@/app/assets/mainsubbg.png";
import Logo from "@/app/assets/logo.png";
import Profile from "@/app/assets/profile.png";
import Dashboard from "@/app/Components/Dashboard";
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

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"], // ABeeZee only supports 400 (normal) and 400 italic
  variable: "--font-roboto", // use a matching variable name
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

  const router = useRouter();

  const [canAgree, setCanAgree] = useState(false);
  const scrollRef = useRef(null);

  // check scroll position
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || canAgree) return; // already true, no need to check

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setCanAgree(true);
    }
  };

  const [isOpenacc, setIsOpenacc] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("activetab") || "Dashboard";
    }
    return "Dashboard";
  });
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
    if (activeTab === "Dashboard") {
      setActiveTab("Questionnaire"); // switch tab only when question is clicked
      sessionStorage.setItem("activetab", "Questionnaire");
    }
  };

  const dashboardpage = () => {
    if (activeTab === "Questionnaire") {
      setActiveTab("Dashboard"); // switch tab only when question is clicked
      sessionStorage.setItem("activetab", "Dashboard");
      window.location.reload();
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

  const handleTabChange = (tab) => {
    if (activeTab === "Questionnaire" && tab !== "Questionnaire") {
      // Show confirmation modal
      sessionStorage.setItem("activetab", tab);
      setNextTab(tab);
      setIsConfirmOpen(true);
    } else {
      setActiveTab(tab);
      sessionStorage.setItem("activetab", tab);
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

  const [loginopen, setloginopen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("loginclose");
      return stored === "false" ? false : true;
    }
    return false; // fallback for SSR
  });

useEffect(() => {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("loginclose");
    if (stored === "false") {
      setloginopen(false);
    } else {
      setloginopen(true);
    }
  }
}, []);

  const [patientbasic, setpatientbasic] = useState({});
  const [uhid, setUhid] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUhid = sessionStorage.getItem("uhid");
      if (storedUhid) setUhid(storedUhid);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // run once at mount

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [uhid]);

  useEffect(() => {
    if (!uhid) return; // wait until uhid is set

    const fetchPatientReminder = async () => {
      try {
        const res = await axios.get(`${API_URL}patients/${uhid}`);
        const patient = res.data.patient;

        const pickedData = {
          name: patient.Patient?.name ?? "NA",
          uhid: patient.Patient?.uhid ?? "NA",
          left_doctor:
            patient.Practitioners?.left_doctor !== "NA"
              ? patient.Practitioners?.left_doctor
              : "Doctor",
          right_doctor:
            patient.Practitioners?.right_doctor !== "NA"
              ? patient.Practitioners?.right_doctor
              : "Doctor",
          questionnaire_left: patient.Medical_Left ?? {},
          questionnaire_right: patient.Medical_Right ?? {},
        };

        setpatientbasic(pickedData);
        // console.log("Data", pickedData);
        sessionStorage.setItem("loginclose", "false");
        setloginopen(false);
      } catch (err) {
        showWarning(err);
        // console.error("Error fetching patient reminder:", err);
      }
    };

    fetchPatientReminder();
  }, [uhid]);

  const renderSelectedcomponent = () => {
    switch (activeTab) {
      case "Dashboard":
        return patientbasic && patientbasic.uhid ? ( // ✅ only render if data exists
          <Dashboard
            questionnairepage={questionnairepage}
            patient={patientbasic}
            user={userData}
          />
        ) : (
          <p>Loading patient data...</p> // or null / spinner
        );

      case "Questionnaire":
        return <Questionnaire dashboardpage={dashboardpage} />;

      default:
        return null;
    }
  };

  useEffect(() => {
    let patientPassword = null;

    if (typeof window !== "undefined") {
      patientPassword = sessionStorage.getItem("password"); // 👈 safe access
    }

    if (patientPassword === "patient@123") {
      setTermsopen(true);
    }
  }, []);

  const [showresetpassword, setshowresetpassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showWarning("Please fill in both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      showWarning("Passwords do not match");
      return;
    }
    let adminUhid = null;
    if (typeof window !== "undefined") {
      adminUhid = sessionStorage.getItem("uhid"); // 👈 safe access
    }

    const payload = {
      uhid: adminUhid,
      role: "patient",
      new_password: newPassword,
    };

    try {
      await axios.patch(`${API_URL}auth/reset-password`, payload);

      showWarning(`Password reset successfull`);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("password", newPassword); // 👈 safe access
      }
      window.location.reload();
    } catch (error) {
      // console.error("Error reset password:", error);
      showWarning(`Failed to reset password for ${adminUhid}`);
    }
  };

  const [showAlert, setshowAlert] = useState(false);
  const [alermessage, setAlertMessage] = useState("");
  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  const handlelogout = () => {
    console.clear();
    setloginopen(true);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("activetab");
      sessionStorage.removeItem("uhid");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("activetab");
      sessionStorage.setItem("loginclose", "true");
    }
  };

  const [showPassword, setshowPassword] = useState(false);

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
                      <Image src={Logo} alt="XoLabs" className="w-16 h-10" />
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
                            activeTab === tab ? "text-[#6599D0]" : "text-black"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="w-2/7 flex flex-row items-center justify-end gap-8">
                      <ArrowRightStartOnRectangleIcon
                        className="w-6 h-6 text-black cursor-pointer"
                        onClick={handlelogout}
                      />
                      <div
                        className={`w-fit flex flex-row h-full items-center gap-4`}
                      >
                        <p
                          className={`${inter.className} font-semibold text-[#29272A]`}
                        >
                          {patientbasic?.uhid || "Patient Name"}
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
                    <Image src={Profile} alt="Support" className="w-10 h-10" />
                    <p className="font-semibold text-[#29272A]">
                      {patientbasic?.uhid || "Patient Name"}
                    </p>
                    <ArrowRightStartOnRectangleIcon
                        className="w-6 h-6 text-black cursor-pointer"
                        onClick={handlelogout}
                      />
                  </div>
                  <nav className="p-4 space-y-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`relative font-semibold text-lg ${
                          raleway.className
                        } cursor-pointer ${
                          activeTab === tab ? "text-[#6599D0]" : "text-black"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}
            <div className={`w-full h-[90%]`}>{renderSelectedcomponent()}</div>
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
              Are you sure you want to leave the Questionnaire? Your responses
              will be lost.
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
          }}
        >
          <div className="w-6/7 h-6/7 flex flex-col items-start justify-center gap-8 p-6 mx-auto border rounded-xl shadow-md bg-white">
            <h2
              className={`${inter.className} text-2xl font-semibold mb-4 text-[#2F447A]`}
            >
              Terms and Conditions
            </h2>

            <p
              className={`${inter.className} text-lg font-semibold mb-4 text-black`}
            >
              Effective Date: 31 July 2025
            </p>

            <div
              ref={scrollRef}
              onScroll={handleScroll} // use React onScroll
              className={`${roboto.className} font-medium text-lg h-full p-4 mb-4   text-gray-700 overflow-y-auto max-h-[600px] inline-scroll`}
            >
              <p>
                Welcome to XoLabs Pvt Ltd. By accessing or using our
                Patient-Reported Outcome Measures (PROM) platform, you agree to
                the following Terms and Conditions. Please read them carefully
                before using the platform.
                <br />
                <br />
                <strong>1. Acceptance of Terms</strong>
                <br />
                By registering for and/or using this website, you agree to be
                bound by these Terms and Conditions and our Privacy Policy. If
                you do not agree, please do not use the service.
                <br />
                <br />
                <strong>2. Purpose of the Platform</strong>
                <br />
                This platform is designed to:
                <br />- Allow patients to complete clinical questionnaires and
                outcome forms.
                <br />- Help healthcare providers track recovery and monitor
                progress.
                <br />- Provide patients with insights and educational material
                related to their care.
                <br />
                This service does not replace professional medical advice,
                diagnosis, or treatment.
                <br />
                <br />
                <strong>3. Eligibility</strong>
                <br />
                You must be at least 18 years old, or have legal guardian
                consent if under 18, to use this platform. Use of the platform
                is limited to individuals authorized by a participating
                healthcare provider or institution.
                <br />
                <br />
                <strong>4. Data Collection and Use</strong>
                <br />
                By using the platform, you consent to the collection, use,
                storage, and sharing of your personal and health information as
                outlined in our Privacy Policy. This may include:
                <br />- Questionnaire responses
                <br />- Contact and identification information
                <br />- Usage data
                <br />
                All data is handled in compliance with applicable data
                protection laws, including [e.g., HIPAA if in the US, or
                applicable national regulations].
                <br />
                <br />
                <strong>5. User Responsibilities</strong>
                <br />
                You agree to:
                <br />- Provide accurate and complete information.
                <br />- Use the service only for lawful and authorized purposes.
                <br />- Not share your login credentials with others.
                <br />
                You are responsible for all activities that occur under your
                account.
                <br />
                <br />
                <strong>6. Security</strong>
                <br />
                We implement appropriate technical and organizational measures
                to protect your data.
                <br />
                <br />
                <strong>7. No Medical Advice</strong>
                <br />
                The platform may provide general information and automated
                feedback based on your input. This content is not a substitute
                for professional medical advice. Always consult your healthcare
                provider for medical concerns.
                <br />
                <br />
                <strong>8. Service Modifications</strong>
                <br />
                We may update, suspend, or discontinue the service (or parts of
                it) at any time without notice. We are not liable for any
                changes or interruptions.
                <br />
                <br />
                <strong>9. Intellectual Property</strong>
                <br />
                All content, branding, and technology on this platform are owned
                by XoLabs Pvt Ltd and protected by copyright and trademark laws.
                <br />
                <br />
                <strong>10. Termination</strong>
                <br />
                We may suspend or terminate your access if you violate these
                Terms. You may also stop using the service at any time.
                <br />
                <br />
                <strong>11. Limitation of Liability</strong>
                <br />
                We are not liable for any indirect, incidental, or consequential
                damages resulting from your use of the service. Use is at your
                own risk.
                <br />
                <br />
                <strong>12. Governing Law</strong>
                <br />
                These Terms are governed by the laws of India. Any disputes
                shall be resolved in the courts of Chennai, Tamil Nadu.
                <br />
                <br />
                <strong>13. Changes to Terms</strong>
                <br />
                We may update these Terms occasionally. Continued use after such
                changes indicates your acceptance. The latest version will
                always be posted on the website.
                {/* <br />
            <br />
            <strong>14. Contact Us</strong>
            <br />
            For questions or concerns about these Terms, contact: */}
                <br />
                <br />
                XoLabs Pvt Ltd
                <br />
              </p>
            </div>

            <div className={`w-full flex justify-end`}>
              <div className="flex space-x-4 ">
                <button
                  onClick={() => {
                    setTermsopen(false);
                    setshowresetpassword(true);
                  }}
                  disabled={!canAgree}
                  className={`${
                    raleway.className
                  } font-semibold text-lg px-12 py-2 rounded-md ${
                    canAgree
                      ? "bg-[#2F447A] text-white cursor-pointer"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Agree
                </button>
              </div>
            </div>
          </div>
          <style>
            {`
      .inline-scroll::-webkit-scrollbar {
        width: 12px;
      }
      .inline-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .inline-scroll::-webkit-scrollbar-thumb {
        background-color: #2D4176;
        border-radius: 8px;
      }

      .inline-scroll {
        scrollbar-color: #2D4176 transparent;
      }
    `}
          </style>
        </div>
      )}

      {showresetpassword && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
          }}
        >
          <div
            className={`
    h-fit flex flex-col items-center justify-center mx-auto my-auto bg-white p-8 rounded-2xl
    ${width < 950 ? "gap-4 w-full" : "w-1/2"}
  `}
          >
            <h2
              className={`${raleway.className} text-2xl font-semibold text-gray-800 mb-6`}
            >
              Reset Password
            </h2>

            <div className={`${poppins.className} w-full flex flex-col gap-8`}>
              {/* New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-base text-gray-700">New Password</label>
                <input
                  type="password"
                  className="w-full border-b-2 border-gray-400 outline-none px-2 py-2 text-lg bg-transparent text-black"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-base text-gray-700">
                  Confirm Password
                </label>
                {/* <input
                  type="text"
                  className="w-full border-b-2 border-gray-400 outline-none px-2 py-2 text-lg bg-transparent text-black"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                /> */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${poppins.className} w-full border-b-2 border-gray-400 outline-none px-2 py-2 text-lg bg-transparent text-black`}
                  />
                  {/* Password show/hide icon placeholder on right */}
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    aria-label="Toggle Password Visibility"
                    onClick={() => setshowPassword((prev) => !prev)}
                  >
                    {!showPassword ? (
                      <svg
                        width="22"
                        height="14"
                        viewBox="0 0 22 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.8813 8.95454C2.78664 4.607 6.57133 1.51792 10.8286 1.51792C15.0845 1.51792 18.8692 4.607 19.7759 8.95454C19.8118 9.12705 19.9148 9.27823 20.0622 9.37483C20.2095 9.47142 20.3893 9.50551 20.5618 9.4696C20.7343 9.43369 20.8855 9.33072 20.9821 9.18334C21.0787 9.03596 21.1127 8.85624 21.0768 8.68373C20.0454 3.73882 15.731 0.19043 10.8286 0.19043C5.92616 0.19043 1.61181 3.73882 0.580352 8.68373C0.544441 8.85624 0.578532 9.03596 0.675126 9.18334C0.77172 9.33072 0.922904 9.43369 1.09542 9.4696C1.26794 9.50551 1.44765 9.47142 1.59503 9.37483C1.74241 9.27823 1.84538 9.12705 1.8813 8.95454V8.95454ZM10.8153 4.17291C12.0476 4.17291 13.2294 4.66242 14.1007 5.53375C14.972 6.40509 15.4615 7.58688 15.4615 8.81913C15.4615 10.0514 14.972 11.2332 14.1007 12.1045C13.2294 12.9758 12.0476 13.4654 10.8153 13.4654C9.58306 13.4654 8.40128 12.9758 7.52994 12.1045C6.65861 11.2332 6.1691 10.0514 6.1691 8.81913C6.1691 7.58688 6.65861 6.40509 7.52994 5.53375C8.40128 4.66242 9.58306 4.17291 10.8153 4.17291V4.17291Z"
                          fill="#949BA5"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="22"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.94 17.94C16.11 19.22 13.98 20 12 20C7 20 2.73 16.11 1 12C1.73947 10.1399 2.98478 8.51516 4.6 7.28M9.9 5.1C10.59 5.03 11.29 5 12 5C17 5 21.27 8.89 23 13C22.4311 14.3882 21.588 15.6563 20.52 16.73M1 1L23 23"
                          stroke="#949BA5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleResetPassword}
                className="cursor-pointer mt-4 w-full bg-[#319B8F] text-white font-semibold py-2 rounded-lg hover:bg-[#26776f] transition-all"
              >
                Reset Password
              </button>
            </div>
          </div>

          {showAlert && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                {alermessage}
              </div>
            </div>
          )}

          <style>
            {`
                .inline-scroll::-webkit-scrollbar {
                  width: 12px;
                }
                .inline-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .inline-scroll::-webkit-scrollbar-thumb {
                  background-color: #076C40;
                  border-radius: 8px;
                }
          
                .inline-scroll {
                  scrollbar-color: #076C40 transparent;
                }
              `}
          </style>

          {showAlert && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                {alermessage}
              </div>
            </div>
          )}
        </div>
      )}

      <Login
        isTermsopen={loginopen}
        isTermsclose={() => {
          setloginopen(false);

          if (typeof window !== "undefined") {
            sessionStorage.setItem("loginclose", false);
            const pass = sessionStorage.getItem("password");
            if (pass === "patient@123") {
              setTermsopen(true);
            } else {
              setTermsopen(false);
            }
          }
        }}
        onLoginSuccess={(uhidValue) => setUhid(uhidValue)}
      />
    </div>
  );
}
