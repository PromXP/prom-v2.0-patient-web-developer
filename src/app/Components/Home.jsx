"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import axios from "axios";

import { API_URL } from "../libs/global";

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

const Home = ({questionnairepage}) => {
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

  const assessments = [
    {
      id: 1,
      title: "OXFORD KNEE SCORE",
      side: "Left",
      deadline: "30 Jul 2025",
      numQuestions: 12,
      duration: "15 min",
      status: "Completed",
    },
    {
      id: 2,
      title: "SF-12",
      side: "Right",
      deadline: "01 Aug 2025",
      numQuestions: 10,
      duration: "12 min",
      status: "Completed",
    },
    {
      id: 3,
      title: "KOOS JR",
      side: "Left",
      deadline: "05 Aug 2025",
      numQuestions: 8,
      duration: "10 min",
      status: "Pending",
    },
    {
      id: 4,
      title: "FJS",
      side: "Right",
      deadline: "10 Aug 2025",
      numQuestions: 6,
      duration: "8 min",
      status: "Completed",
    },
    {
      id: 5,
      title: "KSS",
      side: "Left",
      deadline: "12 Aug 2025",
      numQuestions: 14,
      duration: "20 min",
      status: "Pending",
    },
    {
      id: 6,
      title: "OXFORD KNEE SCORE",
      side: "Right",
      deadline: "15 Aug 2025",
      numQuestions: 12,
      duration: "15 min",
      status: "Completed",
    },
    {
      id: 7,
      title: "SF-12",
      side: "Left",
      deadline: "18 Aug 2025",
      numQuestions: 10,
      duration: "12 min",
      status: "Completed",
    },
    {
      id: 8,
      title: "KOOS JR",
      side: "Right",
      deadline: "20 Aug 2025",
      numQuestions: 8,
      duration: "10 min",
      status: "Pending",
    },
    {
      id: 9,
      title: "FJS",
      side: "Left",
      deadline: "22 Aug 2025",
      numQuestions: 6,
      duration: "8 min",
      status: "Completed",
    },
    {
      id: 10,
      title: "KSS",
      side: "Right",
      deadline: "25 Aug 2025",
      numQuestions: 14,
      duration: "20 min",
      status: "Pending",
    },
  ];

  const [userData, setUserData] = useState(null);
  const [patientdata, setpatientdata] = useState();
  const handleUserData = (data) => {
    setUserData(data);
    setpatientdata(data.user);
  };

  useEffect(() => {
    const uhid = sessionStorage.getItem("uhid");
    const password = sessionStorage.getItem("password");

    const userin = sessionStorage.getItem("userinfo");
    if (userin) {
      const parsedUser = JSON.parse(userin); // Parse the string to an actual object
      console.log("User Info", parsedUser);
    } else {
      console.log("No user info found in sessionStorage.");
    }
    // If userData already exists, don't fetch again
    if (userData && userData.user) return;

    if (uhid && password) {
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

  const [transformedData, setTransformedData] = useState([]);

  const mapQuestionnaireData = (assignedList, leg) => {
    return assignedList.map((item) => {
      const name = item.name.toLowerCase();
      let questions = 0;
      let duration = "";

      if (name.includes("oxford knee score")) {
        questions = 12;
        duration = "15 min";
      } else if (name.includes("short form - 12")) {
        questions = 12;
        duration = "15 min";
      } else if (name.includes("koos")) {
        questions = 7;
        duration = "12 min";
      } else if (name.includes("knee society score")) {
        questions = 8;
        duration = "12 min";
      } else if (name.includes("forgotten joint score")) {
        questions = 12;
        duration = "15 min";
      }

      return {
        status: item.completed === 1 ? "Completed" : "Pending",
        period: item.period,
        title: item.name,
        periodShort: item.period,
        questions: questions,
        duration: duration,
        assigned_date: item.assigned_date,
        deadline: item.deadline,
        leg: leg, // <-- Added leg here
      };
    });
  };

  const isQuestionnaireVisible = (q, today) => {
    const deadlineDate = new Date(q.deadline);
    const surgeryDate = q.surgery_date ? new Date(q.surgery_date) : null;
    const now = today;

    // Example: Pre-op if period contains "PRE OP" (adjust as needed)
    if (q.period && q.period.toUpperCase().includes("PRE OP")) {
      // Show only if today is before surgery date
      return surgeryDate ? now < surgeryDate : true;
    } else {
      // Post-op: show if today is on/before deadline and not more than 14 days after deadline
      const daysAfterDeadline = (now - deadlineDate) / (1000 * 60 * 60 * 24);
      return (
        now >= deadlineDate ||
        (daysAfterDeadline > 0 && daysAfterDeadline <= 14)
      );
    }
  };

  useEffect(() => {
    const tempData = [];
    const today = new Date();

    const processSide = (assignedList, surgeryDateStr, sideLabel) => {
      const surgeryDate = surgeryDateStr;
      const enriched = assignedList.map((q) => ({
        ...q,
        surgery_date: surgeryDate,
      }));

      const live = [];
      const expiredPending = [];

      enriched.forEach((q) => {
        if (isQuestionnaireVisible(q, today)) {
          live.push(q);
        } else {
          const deadline = new Date(q.deadline);
          const daysAfterDeadline = (today - deadline) / (1000 * 60 * 60 * 24);
          if (q.completed === 0 && today > deadline && daysAfterDeadline > 14) {
            expiredPending.push(q);
          }
        }
      });
      // 1. Sort by deadline descending
      expiredPending.sort(
        (a, b) => new Date(b.deadline) - new Date(a.deadline)
      );

      // 2. Get latest deadline date
      const latestDeadline =
        expiredPending.length > 0 ? expiredPending[0].deadline : null;

      // 3. Filter all expired with the latest deadline
      const latestExpired = latestDeadline
        ? expiredPending.filter((q) => q.deadline === latestDeadline)
        : [];

      const combined = [...live, ...latestExpired];

      // Attach side and sort final combined data by deadline
      return mapQuestionnaireData(combined, sideLabel).sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
    };

    if (userData?.user?.questionnaire_assigned_left) {
      const leftResult = processSide(
        userData.user.questionnaire_assigned_left,
        userData?.user?.post_surgery_details_left?.date_of_surgery,
        "Left"
      );
      tempData.push(...leftResult);
    }

    if (userData?.user?.questionnaire_assigned_right) {
      const rightResult = processSide(
        userData.user.questionnaire_assigned_right,
        userData?.user?.post_surgery_details_right?.date_of_surgery,
        "Right"
      );
      tempData.push(...rightResult);
    }

    setTransformedData(tempData);
  }, [userData]);

  const handlequestionnaireclick = (title, period, leg) => {
    // console.log("Questionnaire Data", transformedData); // log the mapped value here
    // console.log("Selected Questionnaire:", title);
    // console.log("Period:", period);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("questionnaire_title", title);
      sessionStorage.setItem("questionnaire_period", period);
      sessionStorage.setItem("questionnaire_leg", leg);
      sessionStorage.setItem("uhid", userData.user.uhid);
      sessionStorage.setItem(
        "name",
        userData.user.first_name + " " + userData.user.last_name
      );
    }
    questionnairepage();
  };

  return (
    <>
      <div className="w-full h-full">
        <div className={`w-full pt-8 ${width < 800 ? "h-full" : "h-[35%]"}`}>
          <div
            className={`w-full h-full flex ${
              width < 800 ? "flex-col" : "flex-row"
            }`}
            style={{
              background:
                "linear-gradient(to right, #2D4176, #5A87C8, #42629C)",
            }}
          >
            <div
              className={`h-full flex flex-col justify-center py-4 pl-8 pr-1 ${
                width < 800 ? "w-full" : "w-3/5"
              }`}
            >
              <p
                className={`${poppins.className} font-normal text-base text-white`}
              >
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className={`flex flex-col`}>
                <p
                  className={`${poppins.className} font-semibold text-[32px] text-white`}
                >
                  Welcome back,{" "}
                  {userData?.user?.first_name +
                    " " +
                    userData?.user?.last_name || "Patient Name"}
                </p>
                <p
                  className={`${poppins.className} font-normal text-base text-white opacity-75`}
                >
                  A complete questionnaire section
                </p>
              </div>
            </div>
            <div
              className={`h-full flex flex-col justify-end pr-8 pl-1 py-2 ${
                width < 800 ? "w-full" : "w-2/5"
              }`}
            >
              <div
                className={`w-full h-1/2 flex flex-col items-end justify-center`}
              >
                <p
                  className={`${raleway.className} font-extrabold text-2xl text-white`}
                >
                  Dr. Lilly / Dr. Lilly
                </p>
                <p
                  className={`${abeezee.className} font-normal text-lg text-white`}
                >
                  Currently Assigned
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-full  flex items-center gap-8 ${
            width < 800
              ? "h-full py-8 overflow-y-auto flex-col inline-scroll"
              : "h-[65%] overflow-x-scroll flex-row inline-scroll"
          } ${width < 480 ? "px-4" : "px-8"}`}
        >
          {[...transformedData].map((item, index) => (
            <div
              key={index}
              className={` shrink-0 whitespace-nowrap rounded-2xl shadow-2xl bg-white flex flex-col justify-between py-8 cursor-pointer ${
                width < 800 ? "h-96 w-full" : "h-6/7 w-96"
              } ${width < 500 ? "px-4" : "px-8"}`}
              onClick={() =>
                item.status === "Pending" &&
                handlequestionnaireclick(item.title, item.period, item.leg)
              }
            >
              <div className={`w-full flex justify-end`}>
                <p
                  className={`w-fit rounded-full px-3 py-1 ${
                    item.status === "Completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  } ${abeezee.className} font-normal text-base text-white`}
                >
                  {item.status}
                </p>
              </div>
              <div className={`w-full flex flex-col gap-4`}>
                <p
                  className={`${raleway.className} font-extrabold text-xl text-[#1E1E1E] break-words whitespace-normal`}
                >
                  {item.title}
                </p>
                <p
                  className={`${abeezee.className} font-normal text-lg text-black`}
                >
                  {item.leg} Knee
                </p>
              </div>
              <div
                className={`w-full flex ${
                  width < 450
                    ? "flex-col items-center gap-4"
                    : "flex-row justify-between"
                } `}
              >
                <div
                  className={` ${
                    width < 450 ? "w-full" : "w-1/3"
                  } flex flex-col items-start break-words`}
                >
                  <p
                    className={`${abeezee.className} font-normal text-sm text-[#3C3C3C]`}
                  >
                    Deadline
                  </p>
                  <p
                    className={`${poppins.className} font-extrabold text-xl text-black text-start break-words whitespace-normal`}
                  >
                    {item.period && item.period.toUpperCase().includes("PRE OP")
                      ? item.leg === "Left"
                        ? userData?.user?.post_surgery_details_left
                            ?.date_of_surgery
                          ? new Date(
                              new Date(
                                userData.user.post_surgery_details_left.date_of_surgery
                              ).getTime() -
                                1 * 24 * 60 * 60 * 1000
                            ).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "No Surgery Date"
                        : userData?.user?.post_surgery_details_right
                            ?.date_of_surgery
                        ? new Date(
                            new Date(
                              userData.user.post_surgery_details_right.date_of_surgery
                            ).getTime() -
                              1 * 24 * 60 * 60 * 1000
                          ).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "No Surgery Date"
                      : new Date(
                          new Date(item.deadline).getTime() +
                            14 * 24 * 60 * 60 * 1000
                        ).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                  </p>
                </div>
                <div
                  className={`${
                    width < 450 ? "w-full" : "w-2/3"
                  } flex flex-row justify-between`}
                >
                  <div className={`w-1/2 flex flex-col items-start`}>
                    <p
                      className={`${abeezee.className} font-normal text-sm text-[#3C3C3C]`}
                    >
                      No. of Qn
                    </p>
                    <p
                      className={`${poppins.className} font-extrabold text-xl text-black`}
                    >
                      {item.questions}
                    </p>
                  </div>
                  <div className={`w-1/2 flex flex-col items-start`}>
                    <p
                      className={`${abeezee.className} font-normal text-sm text-[#3C3C3C]`}
                    >
                      Duration
                    </p>
                    <p
                      className={`${poppins.className} font-extrabold text-xl text-black`}
                    >
                      15 min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </>
  );
};

export default Home;
