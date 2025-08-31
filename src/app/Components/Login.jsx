"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import axios from "axios";

import { API_URL } from "../libs/global";

import { Raleway, Inter, Poppins } from "next/font/google";

import MainBg from "@/app/assets/mainbg.png";
import MainsubBg from "@/app/assets/mainsubbg.png";
import Logo from "@/app/assets/logo.png";
import AdminImage from "@/app/assets/patientlogin.png";

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
  variable: "--font-inter", // optional CSS variable name
});

const Login = ({ isTermsopen, isTermsclose, onLoginSuccess  }) => {
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

  const [userUHID, setuserUHID] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [alermessage, setAlertMessage] = useState("");
  const [response, setResponse] = useState(null);

  const fetchData = async () => {
    if (!userUHID.trim()) return showWarning("UHID / PHONE is required");
    if (!userPassword.trim()) return showWarning("PASSWORD is required");

    try {
      const res = await axios.post(`${API_URL}auth/login`, {
        identifier: userUHID,
        password: userPassword,
        type: "patient",
      });

      setResponse(res.data);

      console.log("LOGIN",res.data.user_id);

      // Store in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("uhid", res.data.user_id);
        sessionStorage.setItem("password", userPassword);
        sessionStorage.setItem("activetab", "Dashboard");
        sessionStorage.setItem("loginclose", "false"); // keep session alive for reload
        onLoginSuccess(res.data.user_id);
      }

      isTermsclose();
    } catch (err) {
      showWarning("Login failed. Please check your credentials.");
      // console.error("POST error:", err);
    }
  };


  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // const handleForgotPassword = async () => {
  //   if (!userUHID) {
  //     showWarning("Please enter your UHID");
  //     setshowAlert(true);
  //     setTimeout(() => setshowAlert(false), 3000);
  //     return;
  //   }
  //   if (!resetEmail) {
  //     showWarning("Please enter your registered Email");
  //     setshowAlert(true);
  //     setTimeout(() => setshowAlert(false), 3000);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${API_URL}request_password_reset?uhid=${encodeURIComponent(
  //         userUHID
  //       )}&email=${encodeURIComponent(resetEmail)}`
  //     );

  //     const data = response.data;

  //     if (response.ok) {
  //       showWarning("Reset link sent to your email.");
  //     }
  //     // else {
  //     //   showWarning(data.message || "Failed to send reset link.");
  //     // }
  //   } catch (error) {
  //     console.log("Error reset", error);
  //     showWarning("Entered credentials are incorrect Check your credentials");
  //   }

  //   setshowAlert(true);
  //   setTimeout(() => setshowAlert(false), 3000);
  // };

  if (!isTermsopen) return null;

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
      <div className="w-full h-full absolute inset-0 p-2 box-border rounded-4xl ">
        <div className="w-full h-full relative rounded-4xl border-white border-[1px] bg-white/10 ring-1 ring-white/30 backdrop-blur-lg p-3 shadow-[0_0_0_0.5px_rgba(255,255,255,0.3)] flex flex-row">
          <div className="w-full h-full relative rounded-4xl bg-white/10 backdrop-blur-lg p-3 shadow-[0_0_0_0.5px_rgba(255,255,255,0.3)] flex flex-row justify-center items-center">
            <div className="absolute top-6 left-6 flex flex-col items-center">
              <Image src={Logo} alt="XoLabs" className="w-20 h-12" />
              <span
                className={`${raleway.className} text-lg text-black font-semibold`}
              >
                Patient
              </span>
            </div>

            <div
              className={`${
                width >= 550 ? "w-7/9 h-6/7" : "w-full h-full p-2"
              }  bg-white rounded-[15px] flex ${
                width >= 1000 ? "flex-row" : "flex-col"
              } `}
            >
              {width >= 0 && (
                <div
                  className={`${
                    width >= 1000 ? "basis-1/3 max-h-full" : "basis-full h-1/2"
                  }   py-4 pl-4 flex ${
                    width >= 1000 ? "flex-row" : "flex-col"
                  } justify-between items-center`}
                >
                  <Image
                    src={AdminImage}
                    alt="Admin"
                    className={`w-15/16 h-full object-cover  ${
                      width >= 1000 ? "rounded-l-xl" : "rounded-xl"
                    }`}
                  />
                  <div className={`bg-[#252425] opacity-20 h-7/9 w-0.5`}></div>
                </div>
              )}

              <div
                className={`relative flex flex-col justify-center items-center flex-1  text-gray-900 ${
                  width < 1000 ? "basis-full p-4 h-1/2" : "basis-2/3 p-10"
                }`}
              >
                {/* Top-left logo + role */}

                {!showForgotPassword && (
                  <div
                    className={`flex flex-col h-fit ${
                      width >= 550 ? "w-5/7" : "w-full"
                    }`}
                  >
                    {/* Form */}
                    <h2
                      className={`${inter.className} text-2xl font-bold mb-8 w-fit`}
                    >
                      Nice to See you again
                    </h2>

                    <form
                      className={`flex flex-col space-y-6 ${
                        width < 1000 ? "max-w-full" : "max-w-sm"
                      }`}
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevent form reload
                        fetchData(); // Call your login function
                      }}
                    >
                      <input
                        type="text"
                        placeholder="UHID / Phone"
                        value={userUHID}
                        onChange={(e) => setuserUHID(e.target.value)}
                        className={`${poppins.className} rounded-md p-3 text-sm text-gray-900 placeholder-black bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-teal-400`}
                      />
                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={userPassword}
                          onChange={(e) => setuserPassword(e.target.value)}
                          className={`${poppins.className} w-full rounded-md text-sm p-3 text-gray-900 placeholder-black bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-teal-400`}
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

                      <div className="flex justify-end">
                        <a
                          onClick={() => setShowForgotPassword(true)}
                          className={`${inter.className} text-sm text-gray-500 hover:underline cursor-pointer`}
                        >
                          Forgot Password ?
                        </a>
                      </div>

                      <button
                        type="submit"
                        className={`${raleway.className} w-full text-lg cursor-pointer bg-[#2F447A] text-white rounded-md py-1 font-semibold hover:bg-gray-800 transition`}
                      >
                        Sign In
                      </button>
                    </form>
                  </div>
                )}
                {showForgotPassword && (
                  <div
                    className={`flex flex-col h-fit ${
                      width >= 550 ? "w-5/7" : "w-full"
                    }`}
                  >
                    <h2
                      className={`${inter.className} text-2xl font-bold mb-8 w-fit text-[#2F447A]`}
                    >
                      Reset Password
                    </h2>
                    <form
                      className={`flex flex-col space-y-6 ${
                        width < 1000 ? "max-w-full" : "max-w-sm"
                      }`}
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevent form reload
                        handleForgotPassword(); // Call your login function
                      }}
                    >
                      <input
                        type="text"
                        placeholder="UHID"
                        value={userUHID}
                        onChange={(e) => setuserUHID(e.target.value)}
                        className={`${poppins.className} rounded-md p-3 text-sm text-gray-900 placeholder-black bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-teal-400`}
                      />
                      <input
                        type="text"
                        placeholder="Registered Email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className={`${poppins.className} rounded-md p-3 text-sm text-gray-900 placeholder-black bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-teal-400`}
                      />

                      <div
                        className={`w-full flex ${
                          width < 600
                            ? "flex-col items-center gap-4"
                            : "flex-row"
                        } justify-between`}
                      >
                        <button
                          type="submit"
                          className={`${raleway.className} ${
                            width < 600 ? "w-fit px-4" : "w-1/2"
                          } text-lg cursor-pointer bg-[#2F447A] text-white rounded-md py-1 font-semibold hover:bg-gray-800 transition`}
                        >
                          Send Reset Link
                        </button>

                        <button
                          className={`${raleway.className} ${
                            width < 600 ? "w-fit px-4" : "w-1/2"
                          } text-lg cursor-pointer  text-black rounded-md py-1 font-semibold`}
                          onClick={() => {
                            setShowForgotPassword(false);
                            setResetEmail("");
                          }}
                        >
                          Back to Login
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {showAlert && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
              {alermessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
