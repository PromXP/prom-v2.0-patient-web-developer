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

const Dashboard = ({ questionnairepage, patient }) => {
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

  const [patientbasic, setpatientbasic] = useState(patient);

  const [showAlert, setshowAlert] = useState(false);
  const [alermessage, setAlertMessage] = useState("");
  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  const [transformedData, setTransformedData] = useState([]);

  const mapQuestionnaireData = (assignedList, leg) => {
  return assignedList.map((item) => {
    const name = item.name.toLowerCase();
    let title = item.name;
    let questions = 0;
    let duration = "";

    if (name.includes("oxford knee score") || name.includes("oks")) {
      title = "Oxford Knee Score (OKS)";
      questions = 12;
      duration = "15 min";
    } else if (name.includes("short form - 12") || name.includes("sf12")) {
      title = "Short Form - 12 (SF-12)";
      questions = 12;
      duration = "10–15 min";
    } else if (name.includes("koos")) {
      title = "Knee Injury and Osteoarthritis Outcome Score, Joint Replacement (KOOS, JR)";
      questions = 7;
      duration = "10–12 min";
    } else if (name.includes("knee society score") || name.includes("kss")) {
      title = "Knee Society Score (KSS)";
      questions = 8;
      duration = "10–12 min";
    } else if (name.includes("forgotten joint score") || name.includes("fjs")) {
      title = "Forgotten Joint Score (FJS)";
      questions = 12;
      duration = "10–15 min";
    }

    return {
      completed: item.completed, // 🔹 keep the raw boolean for sorting
      status: item.completed ? "Completed" : "Pending",
      period: item.period,
      title,
      periodShort: item.period,
      questions,
      duration,
      assigned_date: item.assigned_date,
      deadline: item.deadline,
      leg,
    };
  });
};

useEffect(() => {
  if (!patientbasic) return;

  const today = new Date();

  const transformSide = (sideData, leg) => {
    const questionnaires = [];

    Object.entries(sideData).forEach(([title, periods]) => {
      Object.entries(periods).forEach(([period, data]) => {
        questionnaires.push({
          name: title,
          period,
          completed: data.completed,
          assigned_date: data.assigned_date ?? null,
          deadline: data.deadline,
          surgery_date: data.surgery_date ?? null,
          leg,
        });
      });
    });

    return mapQuestionnaireData(questionnaires, leg);
  };

  const leftData = transformSide(patientbasic.questionnaire_left, "Left");
  const rightData = transformSide(patientbasic.questionnaire_right, "Right");

  let merged = [...leftData, ...rightData];

  // 🔹 Step 2: Filter by deadline rules
  // merged = merged.filter((q) => {
  //   if (!q.deadline) return false;

  //   const deadlineDate = new Date(q.deadline);
  //   const diffDays = (today - deadlineDate) / (1000 * 60 * 60 * 24);

  //   // Include if deadline passed or within -14 days
  //   return today >= deadlineDate || (diffDays > -14 && diffDays < 0);
  // });

  // 🔹 Step 3: Sort
  merged.sort((a, b) => {
    // 1️⃣ Pending before Completed
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2️⃣ Left before Right
    if (a.leg !== b.leg) {
      return a.leg === "Left" ? -1 : 1;
    }

    // 3️⃣ Sort by deadline
    return new Date(a.deadline) - new Date(b.deadline);
  });

  setTransformedData(merged);
}, [patientbasic]);


  const handlequestionnaireclick = (title, period, leg) => {
    // console.log("Questionnaire Data", transformedData); // log the mapped value here
    // console.log("Selected Questionnaire:", title);
    // console.log("Period:", period);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("questionnaire_title", title);
      sessionStorage.setItem("questionnaire_period", period);
      sessionStorage.setItem("questionnaire_leg", leg);
      sessionStorage.setItem("uhid", patientbasic?.uhid);
      sessionStorage.setItem("name", patientbasic?.name);
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
                  Welcome back, {patientbasic?.name || "Patient Name"}
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
                  {patientbasic?.left_doctor || "Left Doctor NA"} /{" "}
                  {patientbasic?.right_doctor || "Right Doctor NA"}
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
              className={`shrink-0 whitespace-nowrap rounded-2xl shadow-2xl bg-white flex flex-col justify-between py-8 cursor-pointer ${
                width < 800 ? "h-96 w-full" : "h-6/7 w-96"
              } ${width < 500 ? "px-4" : "px-8"}`}
              onClick={() =>
                item.status === "Pending" &&
                handlequestionnaireclick(item.title, item.period, item.leg)
              }
            >
              {/* Status */}
              <div className="w-full flex justify-end">
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

              {/* Title + Leg */}
              <div className="w-full flex flex-col gap-4">
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

              {/* Deadline, Questions, Duration */}
              <div
                className={`w-full flex ${
                  width < 450
                    ? "flex-col items-center gap-4"
                    : "flex-row justify-between"
                }`}
              >
                <div
                  className={`${
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
                    {item.deadline}
                  </p>
                </div>

                <div
                  className={`${
                    width < 450 ? "w-full" : "w-2/3"
                  } flex flex-row justify-between`}
                >
                  <div className="w-1/2 flex flex-col items-start">
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

                  <div className="w-1/2 flex flex-col items-start">
                    <p
                      className={`${abeezee.className} font-normal text-sm text-[#3C3C3C]`}
                    >
                      Duration
                    </p>
                    <p
                      className={`${poppins.className} font-extrabold text-xl text-black`}
                    >
                      {item.duration || "15 min"}
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

export default Dashboard;
