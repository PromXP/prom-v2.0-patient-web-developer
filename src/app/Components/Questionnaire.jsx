"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ArrowLeftIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";

import MainBg from "@/app/assets/mainbg.png";
import MainsubBg from "@/app/assets/mainsubbg.png";
import Profile from "@/app/assets/profile.png";
import Timepopup from "./Timepopup";
import Commonquestions from "./Commonquestions";
import Submitconfirmpop from "./Submitconfirmpop";

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

const Questionnaire = ({ dashboardpage }) => {
  const router = useRouter();
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

  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [questionnairePeriod, setQuestionnairePeriod] = useState("");
  const [leg, setLeg] = useState("");
  const [patname, setpatname] = useState("");
  const [patid, setpatid] = useState("");
  const [popupStringArray, setPopupStringArray] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTitle = sessionStorage.getItem("questionnaire_title");
      const storedPeriod = sessionStorage.getItem("questionnaire_period");
      const leg1 = sessionStorage.getItem("questionnaire_leg");
      if (storedTitle && storedPeriod) {
        setQuestionnaireTitle(storedTitle);
        setQuestionnairePeriod(storedPeriod);
        setLeg(leg1);
      }
      setpatname(sessionStorage.getItem("name"));
      setpatid(sessionStorage.getItem("uhid"));
    }
  }, [router.isReady]);

  const [questions, setQuestions] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const oks = [
    {
      questionText:
        "1. How would you describe the pain you usually have in your knee?",
      type: "single",
      options: [
        "Severe (0)",
        "Moderate (1)",
        "Mild (2)",
        "Very mild (3)",
        "None (4)",
      ],
    },
    {
      questionText:
        "2. Have you had trouble washing and drying yourself because of your knee?",
      type: "single",
      options: [
        "Impossible to do (0)",
        "Extreme difficulty (1)",
        "Moderate trouble (2)",
        "Very little trouble (3)",
        "No trouble at all (4)",
      ],
    },
    {
      questionText:
        "3. Have you had trouble getting in and out of a car or using public transportation due to your knee?",
      type: "single",
      options: [
        "Impossible to do (0)",
        "Extreme difficulty (1)",
        "Moderate trouble (2)",
        "Very little trouble (3)",
        "No trouble at all (4)",
      ],
    },
    {
      questionText:
        "4. For how long are you able to walk before the pain becomes severe?",
      type: "single",
      options: [
        "Around the house only (0)",
        "5–15 minutes (1)",
        "16–30 minutes (2)",
        "30 minutes or more (3)",
        "No pain (4)",
      ],
    },
    {
      questionText:
        "5. After a meal, how painful has it been to stand up from a chair because of your knee?",
      type: "single",
      options: [
        "Unbearable (0)",
        "Very painful (1)",
        "Moderately painful (2)",
        "Slightly painful (3)",
        "Not at all painful (4)",
      ],
    },
    {
      questionText: "6. Have you been limping because of your knee?",
      type: "single",
      options: [
        "All of the time (0)",
        "Most of the time (1)",
        "Often, not just at first (2)",
        "Sometimes or just at first (3)",
        "Rarely/never (4)",
      ],
    },
    {
      questionText: "7. Could you kneel down and get up again afterwards?",
      type: "single",
      options: [
        "No, impossible (0)",
        "With extreme difficulty (1)",
        "With moderate difficulty (2)",
        "With little difficulty (3)",
        "Yes, easily (4)",
      ],
    },
    {
      questionText: "8. Are you troubled by pain in your knee at night?",
      type: "single",
      options: [
        "Every night (0)",
        "Most nights (1)",
        "Some nights (2)",
        "Only one or two nights (3)",
        "Not at all (4)",
      ],
    },
    {
      questionText:
        "9. How much has your knee interfered with your usual work (including housework)?",
      type: "single",
      options: [
        "Totally (0)",
        "Greatly (1)",
        "Moderately (2)",
        "A little bit (3)",
        "Not at all (4)",
      ],
    },
    {
      questionText: "10. Have you felt that your knee might suddenly give way?",
      type: "single",
      options: [
        "All of the time (0)",
        "Most of the time (1)",
        "Often (2)",
        "Sometimes (3)",
        "Rarely/never (4)",
      ],
    },
    {
      questionText: "11. Could you do household shopping on your own?",
      type: "single",
      options: [
        "No, impossible (0)",
        "With extreme difficulty (1)",
        "With moderate difficulty (2)",
        "With little difficulty (3)",
        "Yes, easily (4)",
      ],
    },
    {
      questionText: "12. Could you walk down a flight of stairs?",
      type: "single",
      options: [
        "No, impossible (0)",
        "With extreme difficulty (1)",
        "With moderate difficulty (2)",
        "With little difficulty (3)",
        "Yes, easily (4)",
      ],
    },
  ];

  const sf = [
    {
      questionText: "In general, would you say your health is:",
      type: "single",
      options: [
        "Excellent (1)",
        "Very Good (2)",
        "Good (3)",
        "Fair (4)",
        "Poor (5)",
      ],
    },
    {
      questionText:
        "Does your health now limit you in moderate activities, such as moving a table, pushing a vacuum cleaner, bowling, or playing golf?",
      type: "single",
      options: [
        "Yes, Limited A Lot (1)",
        "Yes, Limited A Little (2)",
        "No, Not Limited At All (3)",
      ],
    },
    {
      questionText:
        "Does your health now limit you in climbing several flights of stairs?",
      type: "single",
      options: [
        "Yes, Limited A Lot (1)",
        "Yes, Limited A Little (2)",
        "No, Not Limited At All (3)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of your physical health, did you accomplish less than you would like in work or other regular activities?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of your physical health, were you limited in the kind of work or other activities you could perform?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of any emotional problems (such as feeling depressed or anxious), did you accomplish less than you would like?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of any emotional problems (such as feeling depressed or anxious), did you do work or other activities less carefully than usual?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, how much did pain interfere with your normal work (including both work outside the home and housework)?",
      type: "single",
      options: [
        "Not At All (1)",
        "A Little Bit (2)",
        "Moderately (3)",
        "Quite A Bit (4)",
        "Extremely (5)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time have you felt calm and peaceful?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time did you have a lot of energy?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time have you felt downhearted and blue?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (like visiting with friends, relatives, etc.)?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
  ];

  const koos = [
    {
      questionText:
        "S1. How severe is your knee stiffness after first wakening in the morning?",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P1. Amount of pain while twisting/pivoting your knee",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P2. Amount of pain while straightening knee fully",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P3. Amount of pain while going up or down stairs",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P4. Amount of pain while standing upright",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "A1. Degree of difficulty in rising from sitting",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText:
        "A2. Degree of difficulty in bending to the floor/picking up an object",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
  ];

  const ksspreop = [
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while sitting?",
      type: "single",
      options: [
        "Very Satisfied (no pain) (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (severe pain) (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while lying in bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while getting out of bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing light household duties?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing leisure recreational activities?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Do you expect your knee joint replacement surgery will relieve your knee pain?",
      type: "single",
      options: [
        "No, Not at all (1)",
        "Yes, a little bit (2)",
        "Yes, somewhat (3)",
        "Yes, a moderate amount (4)",
        "Yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Do you expect your surgery will help you carry out your normal activities of daily living?",
      type: "single",
      options: [
        "No, Not at all (1)",
        "Yes, a little bit (2)",
        "Yes, somewhat (3)",
        "Yes, a moderate amount (4)",
        "Yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Do you expect your surgery will help you perform leisure, recreational or sports activities?",
      type: "single",
      options: [
        "No, Not at all (1)",
        "Yes, a little bit (2)",
        "Yes, somewhat (3)",
        "Yes, a moderate amount (4)",
        "Yes, a lot (5)",
      ],
    },
  ];

  const ksspostop = [
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while sitting?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while lying in bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while getting out of bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing light household duties?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing leisure recreational activities?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText: "My expectations for pain relief were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "My expectations for being able to do my normal activities of daily living were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "My expectations for being able to do my leisure, recreational or sports activities were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
  ];

  const fjs = [
    {
      questionText: "Are you aware of your knee joint while in bed at night?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while sitting more than an hour?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while walking more than 15 minutes?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while taking a bath or shower?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while traveling in a car?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText: "Are you aware of your knee joint while climbing stairs?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while walking on uneven ground?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while standing up from a low sitting position?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while standing for long periods?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while doing housework or gardening?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while taking a walk or hiking?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while doing your favourite sport?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
  ];

  const ksspreopnew = [
    {
      questionText: "Pain with level walking",
      type: "single",
      options: Array.from({ length: 11 }, (_, i) => `(${i})`),
    },
    {
      questionText: "Pain with stairs or inclines",
      type: "single",
      options: Array.from({ length: 11 }, (_, i) => `(${i})`),
    },
    {
      questionText: 'Does this knee feel "normal" to you?',
      type: "single",
      options: ["Always (5)", "Sometimes (3)", "Never (0)"],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while sitting?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while lying in bed?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while getting out of bed?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing light household duties?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing leisure recreational activities?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Do you expect your knee joint replacement surgery will relieve your knee pain?",
      type: "single",
      options: [
        "no, not at all (1)",
        "yes, a little bit (2)",
        "yes, somewhat (3)",
        "yes, a moderate amount (4)",
        "yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Do you expect your surgery will help you carry out your normal activities of daily living?",
      type: "single",
      options: [
        "no, not at all (1)",
        "yes, a little bit (2)",
        "yes, somewhat (3)",
        "yes, a moderate amount (4)",
        "yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Do you expect your surgery will help you perform leisure, recreational or sports activities?",
      type: "single",
      options: [
        "no, not at all (1)",
        "yes, a little bit (2)",
        "yes, somewhat (3)",
        "yes, a moderate amount (4)",
        "yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Can you walk without any aids (such as a cane, crutches or wheelchair)? If no, which of the following aid(s) do you use?",
      type: "single",
      options: [
        "wheelchair (-10)",
        "one crutch (-4)",
        "walker (-8)",
        "one cane (-4)",
        "crutches (-8)",
        "knee sleeve / brace (-2)",
        "two canes (-6)",
        "None (0)",
      ],
    },
    {
      questionText:
        "For how long can you stand (with or without aid) before sitting due to knee discomfort?",
      type: "single",
      options: [
        "cannot stand (0)",
        "0-5 minutes (3)",
        "6-15 minutes (6)",
        "16-30 minutes (9)",
        "31-60 minutes (12)",
        "more than an hour (15)",
      ],
    },
    {
      questionText:
        "For how long can you walk (with or without aid) before stopping due to knee discomfort?",
      type: "single",
      options: [
        "cannot walk (0)",
        "0-5 minutes (3)",
        "6-15 minutes (6)",
        "16-30 minutes (9)",
        "31-60 minutes (12)",
        "more than an hour (15)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during walking on an uneven surface?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during turning or pivoting on your leg?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during climbing up or down a flight of stairs?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during getting up from a low couch or a chair without arms?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during getting into or out of a car?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during moving laterally (stepping to the side)?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during climbing a ladder or step stool?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during carrying a shopping bag for a block?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText: "How much does your knee bother you during squatting?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText: "How much does your knee bother you during kneeling?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText: "How much does your knee bother you during running?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "Please check 3 of the activities below that you consider most important to you.",
      type: "multi",
      options: [
        "Swimming",
        "Golfing (18 holes)",
        "Road Cycling (>30mins)",
        "Gardening",
        "Bowling",
        "Racquet Sports (Tennis, Racquetball, etc.)",
        "Distance Walking",
        "Dancing / Ballet",
        "Stretching Exercises (stretching out your muscles)",
        "Weight-lifting",
        "Leg Extensions",
        "Stair-Climber",
        "Stationary Biking / Spinning",
        "Leg Press",
        "Jogging",
        "Elliptical Trainer",
        "Aerobic Exercises",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during the activity 1 you selected ?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "cannot do because of knee (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during the activity 2 ?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "cannot do because of knee (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during the activity 3 you selected ?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "cannot do because of knee (0)",
      ],
    },
  ];
  const ksspostopnew = [
    {
      questionText: "Pain with level walking",
      type: "single",
      options: Array.from({ length: 11 }, (_, i) => `(${i})`),
    },
    {
      questionText: "Pain with stairs or inclines",
      type: "single",
      options: Array.from({ length: 11 }, (_, i) => `(${i})`),
    },
    {
      questionText: 'Does this knee feel "normal" to you?',
      type: "single",
      options: ["Always (5)", "Sometimes (3)", "Never (0)"],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while sitting?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while lying in bed?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while getting out of bed?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing light household duties?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing leisure recreational activities?",
      type: "single",
      options: [
        "Very Satisfied (8)",
        "Satisfied (6)",
        "Neutral (4)",
        "Dissatisfied (2)",
        "Very Dissatisfied (0)",
      ],
    },
    {
      questionText: "My expectations for pain relief were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'Too High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Too Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "My expectations for being able to do my normal activities of daily living were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'Too High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Too Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "My expectations for being able to do my leisure, recreational or sports activities were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'Too High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Too Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "Can you walk without any aids (such as a cane, crutches or wheelchair)? If no, which of the following aid(s) do you use?",
      type: "single",
      options: [
        "wheelchair (-10)",
        "one crutch (-4)",
        "walker (-8)",
        "one cane (-4)",
        "crutches (-8)",
        "knee sleeve / brace (-2)",
        "two canes (-6)",
        "None (0)",
      ],
    },
    {
      questionText:
        "For how long can you stand (with or without aid) before sitting due to knee discomfort?",
      type: "single",
      options: [
        "cannot stand (0)",
        "0-5 minutes (3)",
        "6-15 minutes (6)",
        "16-30 minutes (9)",
        "31-60 minutes (12)",
        "more than an hour (15)",
      ],
    },
    {
      questionText:
        "For how long can you walk (with or without aid) before stopping due to knee discomfort?",
      type: "single",
      options: [
        "cannot walk (0)",
        "0-5 minutes (3)",
        "6-15 minutes (6)",
        "16-30 minutes (9)",
        "31-60 minutes (12)",
        "more than an hour (15)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during walking on an uneven surface?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during turning or pivoting on your leg?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during climbing up or down a flight of stairs?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during getting up from a low couch or a chair without arms?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during getting into or out of a car?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during moving laterally (stepping to the side)?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during climbing a ladder or step stool?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during carrying a shopping bag for a block?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText: "How much does your knee bother you during squatting?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText: "How much does your knee bother you during kneeling?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText: "How much does your knee bother you during running?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "I never do this (0)",
        "cannot do (0)",
      ],
    },
    {
      questionText:
        "Please check 3 of the activities below that you consider most important to you.",
      type: "multi",
      options: [
        "Swimming",
        "Golfing (18 holes)",
        "Road Cycling (>30mins)",
        "Gardening",
        "Bowling",
        "Racquet Sports (Tennis, Racquetball, etc.)",
        "Distance Walking",
        "Dancing / Ballet",
        "Stretching Exercises (stretching out your muscles)",
        "Weight-lifting",
        "Leg Extensions",
        "Stair-Climber",
        "Stationary Biking / Spinning",
        "Leg Press",
        "Jogging",
        "Elliptical Trainer",
        "Aerobic Exercises",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during the activity 1 you selected ?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "cannot do because of knee (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during the activity 2 ?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "cannot do because of knee (0)",
      ],
    },
    {
      questionText:
        "How much does your knee bother you during the activity 3 you selected ?",
      type: "single",
      options: [
        "no bother (5)",
        "slight (4)",
        "moderate (3)",
        "severe (2)",
        "very severe (1)",
        "cannot do because of knee (0)",
      ],
    },
  ];

  useEffect(() => {
    if (!questionnaireTitle) return;

    const t = questionnaireTitle.trim().toLowerCase();
    // console.log("Questionnaire", t);

    let selectedQuestions = [];

    if (t === "oxford knee score (oks)") {
      selectedQuestions = oks;
    } else if (t === "forgotten joint score (fjs)") {
      selectedQuestions = fjs;
    } else if (t.includes("koos, jr")) {
      selectedQuestions = koos;
    } else if (t === "knee society score (kss)") {
      const p = questionnairePeriod.trim().toLowerCase();
      // console.log("Inside kss", p);
      selectedQuestions = p.includes("pre") ? ksspreop : ksspostop;
    } else if (t === "short form - 12 (sf-12)") {
      selectedQuestions = sf;
    }

    if (selectedQuestions.length > 0) {
      const shuffledQuestions = selectedQuestions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuestions(shuffledQuestions);
      // console.log("Questions loaded", shuffledQuestions);
    }
  }, [questionnaireTitle, questionnairePeriod]);

  const [currentIndex, _setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("oks_answers");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option) => {
    const t = questionnaireTitle.trim().toLowerCase();
    const id = currentIndex;
    const type = currentQuestion.type;

    let updatedAnswers;

    if (type === "single") {
      updatedAnswers = { ...answers, [id]: [option] };
    } else {
      const selected = answers[id] || [];
      if (selected.includes(option)) {
        updatedAnswers = {
          ...answers,
          [id]: selected.filter((o) => o !== option),
        };
      } else {
        if (t === "knee society score (kss)" && selected.length >= 3) {
          return; // Limit to 3 options for KSS
        }
        updatedAnswers = {
          ...answers,
          [id]: [...selected, option],
        };
      }
    }

    // Set state and sessionStorage using the same updatedAnswers
    setAnswers(updatedAnswers);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("oks_answers", JSON.stringify(updatedAnswers));
    }

    // console.log("Selected options", updatedAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      showWarning("Please wait Submitting on progress...");
      return; // Prevent double submission
    }
    const unanswered = questions.filter((_, idx) => {
      const ans = answers[idx];
      return !ans || ans.length === 0;
    });
    // console.log("Answers", answers);

    if (unanswered.length > 0) {
      setWarning("Please answer all questions before submitting.");
      setTimeout(() => setWarning(false), 2500);
    } else {
      setWarning("");
      // console.log("Submitted answers:", answers);
      const t = questionnaireTitle.trim().toLowerCase();

      let scores = [];

      if (
        t === "oxford knee score (oks)" ||
        t ===
          "knee injury and osteoarthritis outcome score, joint replacement (koos, jr)" ||
        t === "forgotten joint score (fjs)"
      ) {
        const total = calculateTotalScore(answers);
        // console.log("Total Score:", total);
        scores = [total];
      } else if (t === "short form - 12 (sf-12)") {
        const [total, pcs, mcs] = calculateSF12Scores(answers);
        // console.log("SF-12 Scores -> Total:", total, "PCS:", pcs, "MCS:", mcs);
        scores = [total, pcs, mcs];
      } else if (t === "knee society score (kss)") {
        const score = calculateKneeSocietyScore(answers);
        // console.log("KSS Normalized Score:", score);
        scores = [score];
      }
      setIsSubmitting(true);
      const scoreArray = scores.map((s) => parseFloat(s)); // ensure numbers
      if (leg === "Left") {
        const payload = {
          uhid: sessionStorage.getItem("uhid"),
          questionnaire_scores_left: [
            {
              name: questionnaireTitle,
              score: scoreArray,
              period: questionnairePeriod,
              timestamp: Date.now(),
              others: popupStringArray,
            },
          ],
        };
        // console.log("Total Score:", payload);
      }
      // return;
      await sendQuestionnaireScores(scores, Date.now());

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("oks_answers");
      }
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("popup_answers");
      }
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("timepopup");
      }
      setShowConfirmation(false);
      router.replace("/");
      // console.log("Submitted answers:", answers);
    }
  };

  const sendQuestionnaireScores = async (score, timestamp) => {
    if (typeof window === "undefined") return;

    setIsSubmitting(true);

    try {
      const uhid = sessionStorage.getItem("uhid");
      if (!uhid) {
        throw new Error("UHID not found in sessionStorage");
      }

      if (!questionnaireTitle || !questionnairePeriod) {
        throw new Error("Missing questionnaire details (title/period)");
      }

      const scoreArray = (score || []).map((s) => {
        const num = parseFloat(s);
        return isNaN(num) ? 0 : num; // default to 0 if invalid
      });

      const payload = {
        uhid,
        side: leg.toLowerCase() || "NA",
        name: questionnaireTitle || "NA",
        score: scoreArray,
        period: questionnairePeriod || "NA",
        timestamp: new Date().toISOString(),
        others: (popupStringArray || []).map((ans) =>
          ans && ans.trim() !== "" ? ans : "NA"
        ),
      };

      // console.log("PUT Payload:", payload);

      const response = await axios.put(
        `${API_URL}questionnaires/update-score`,
        payload,
        {
          timeout: 10000, // ⏱ timeout after 10s
        }
      );

      showWarning("Questionnaire submitted successfully!");
      dashboardpage();
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof Error) {
        message = error.message;
      }

      showWarning(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  function calculateTotalScore(answers) {
    let totalScore = 0;
    // console.log("Answers:", answers);
    Object.values(answers).forEach((arr) => {
      if (arr.length > 0) {
        const answer = arr[0]; // assuming single-answer selection per question
        const match = answer.match(/\((\d+)\)/);
        // console.log("Total Answer:", answer + " " + match);
        if (match) {
          totalScore += parseInt(match[1]);
        }
      }
    });
    // console.log("Answers:", totalScore);
    return totalScore;
  }

  function calculateKneeSocietyScore(selectedAnswers) {
    let totalScore = 0;

    for (let i = 0; i < 29; i++) {
      const answer = selectedAnswers[i];
      if (!answer) continue;
      if (i === 25) continue;

      const answerText = Array.isArray(answer) ? answer[0] : answer;
      let score = 0;

      const answer1 = answer[0]; // assuming single-answer selection per question
      const match = answer1.match(/\(([-]?\d+)\)/);

      // console.log("Total KSS Pre Op Answers: ", i + " " + match[1]);

      if (i < 5) {
        if (answerText.includes("(0)")) score = 4;
        else if (answerText.includes("(1)")) score = 3;
        else if (answerText.includes("(2)")) score = 2;
        else if (answerText.includes("(3)")) score = 1;
        else if (answerText.includes("(4)")) score = 0;
      } else {
        if (answerText.includes("(1)")) score = 1;
        else if (answerText.includes("(2)")) score = 2;
        else if (answerText.includes("(3)")) score = 3;
        else if (answerText.includes("(4)")) score = 4;
        else if (answerText.includes("(5)")) score = 5;
      }

      let score1 = parseInt(match[1], 10);
      if (i === 0 || i === 1) {
        score1 = 10 - score1;
      }
      totalScore += score1;
    }

    const minScore = 3;
    const maxScore = 35;
    const normalizedScore = Math.max(
      0,
      ((totalScore - minScore) / (maxScore - minScore)) * 100
    );

    return Math.round(normalizedScore);
  }

  function calculateSF12Scores(selectedRadioAnswers) {
    const pcsIndices = [0, 1, 2, 3, 4, 7]; // GH, PF1, PF2, RP1, RP2, BP
    const mcsIndices = [5, 6, 8, 9, 10, 11]; // RE1, RE2, MH1, VT, MH2, SF

    const reverseScoring = [
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
    ];

    const rawScores = new Array(12).fill(0);

    for (let i = 0; i < 12; i++) {
      const answer = selectedRadioAnswers[i]?.[0]; // Access first string from array
      if (!answer) continue;

      let value = 1;
      try {
        const start = answer.lastIndexOf("(") + 1;
        const end = answer.lastIndexOf(")");
        value = parseInt(answer.substring(start, end));
      } catch (e) {
        value = 1; // fallback
      }

      let max;
      if ([8, 9, 10, 11].includes(i)) {
        max = 6;
      } else if ([0, 7].includes(i)) {
        max = 5;
      } else if ([1, 2].includes(i)) {
        max = 3;
      } else if ([3, 4, 5, 6].includes(i)) {
        max = 2;
      } else {
        max = 5; // fallback
      }

      let score;
      if (reverseScoring[i]) {
        score = (max - value) * (100 / (max - 1));
      } else {
        score = (value - 1) * (100 / (max - 1));
      }
      // console.log("SF 12", i + " " + value + " " + max);

      rawScores[i] = score;
    }

    const pcsScore =
      pcsIndices.reduce((acc, i) => acc + rawScores[i], 0) / pcsIndices.length;
    const mcsScore =
      mcsIndices.reduce((acc, i) => acc + rawScores[i], 0) / mcsIndices.length;
    const totalScore = pcsScore + mcsScore;

    // console.log("SF 12",totalScore+" "+pcsScore+" "+mcsScore);

    return [
      Math.round(totalScore / 2),
      Math.round(pcsScore / 2),
      Math.round(mcsScore / 2),
    ];
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only react if currentQuestion exists
      if (!currentQuestion || !currentQuestion.options) return;

      const optionCount = currentQuestion.options.length;
      const pressedNumber = parseInt(e.key, 10);

      // Check if a valid number key was pressed (1-based)
      if (
        !isNaN(pressedNumber) &&
        pressedNumber >= 1 &&
        pressedNumber <= optionCount
      ) {
        const optionToSelect = currentQuestion.options[pressedNumber - 1];
        handleOptionClick(optionToSelect);
        // handleAnswer(optionToSelect);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, handleOptionClick]);

  // Wrap state setter to update visited on navigation
  const setCurrentIndex = (newIndex) => {
    setVisited((prev) => new Set(prev).add(newIndex));
    _setCurrentIndex(newIndex);
  };

  // const handleAnswer = (option) => {
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [currentIndex]: option,
  //   }));
  //   sessionStorage.setItem("oks_answers", JSON.stringify(updatedAnswers));
  // };

  // Check if all questions have been visited
  const allVisited = visited.size === questions.length;

  // Find pending questions (unanswered)
  const pendingQuestions = questions
    .map((_, idx) => idx)
    .filter((idx) => !answers[idx] || answers[idx].length === 0);

  // Handle Next button click
  const handleNext = () => {
    if (!allVisited) {
      // Just move to next question sequentially if not all visited yet
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      // All visited: auto-navigate to first pending question
      if (pendingQuestions.length > 0) {
        // If current question is pending, stay on it; else go to first pending
        if (!pendingQuestions.includes(currentIndex)) {
          setCurrentIndex(pendingQuestions[0]);
        }
      }
    }
  };

  useEffect(() => {
    // When answers load from sessionStorage on mount,
    // mark all answered question indexes as visited
    const answeredIndexes = Object.keys(answers).map((k) => Number(k));
    setVisited((prev) => {
      const newSet = new Set(prev);
      answeredIndexes.forEach((idx) => newSet.add(idx));
      return newSet;
    });
  }, []);

  // Decide if we show Next or Submit button
  const showSubmit = allVisited && pendingQuestions.length === 0;
  const [popupOpen, setPopupOpen] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPopupAnswers = sessionStorage.getItem("popup_answers");
      const timepop = sessionStorage.getItem("timepopup");

      // console.log("Timepopup status", timepop);

      if (timepop !== null) {
        setShowInitialPopup(timepop === "true"); // <-- Convert properly
      }

      if (storedPopupAnswers) {
        let parsedAnswers = JSON.parse(storedPopupAnswers);

        // Replace empty values with "NA"
        parsedAnswers = parsedAnswers.map((ans) => {
          const [key, value] = ans.split(":");
          return `${key}: ${
            value && value.trim() !== "" ? value.trim() : "NA"
          }`;
        });

        setPopupOpen(false);
        setPopupStringArray(parsedAnswers);
      }
    }
  }, []);

  const handleProceed = () => {
    setShowInitialPopup(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("timepopup", "false"); // if you ever need to reset manually
    }
    setPopupOpen(true);
  };

  const handlePopupSubmit = (data) => {
    const stringArray = Object.entries(data).map(
      ([key, value]) => `${key}: ${value}`
    );
    setPopupStringArray(stringArray); // <-- Save globally
    // Save to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("popup_answers", JSON.stringify(stringArray));
    }
    // console.log("Converted Array:", popupStringArray);
  };

  const [showAlert, setshowAlert] = useState(false);
  const [alermessage, setAlertMessage] = useState("");
  const [warning, setWarning] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  const handleCancelSubmit = () => {
    // console.log("Submission cancelled.");
    setShowConfirmation(false);
  };

  const handleConfirmSubmit = () => {
    // console.log("Form submitted successfully!");
    handleSubmit();
  };

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("timepopup"); // if you ever need to reset manually
      sessionStorage.removeItem("popup_answers");
    }
    dashboardpage();
  };

  return (
    <div className={`w-full h-full py-12 ${width >= 800 ? "px-24" : "px-2"}`}>
      {questions.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          Loading questions...
        </div>
      ) : (
        <div
          className={`relative w-full  bg-white rounded-2xl py-12 flex  ${
            width >= 800 ? "flex-row h-full" : "flex-col h-fit gap-10 items-center justify-center"
          }`}
        >
          <button
            onClick={() => handleCancel()} // or use navigate(-1)
            className={`absolute top-2 right-2  text-red-500 flex flex-row items-center px-4 py-1.5 rounded-md text-sm font-semibold hover:scale-120 cursor-pointer transition`}
            title="Cancel the questionnaire"
          >
            < XCircleIcon className={`w-7 h-7 text-red-500`}/>
          </button>
          <div
            className={`${
              width >= 800 ? "w-2/5 py-4 border-r-2 border-gray-300" : "w-full h-full gap-4 border-b-4 py-6 px-4 border-gray-300 justify-between"
            } h-full flex flex-col items-center  gap-8 overflow-y-auto  `}
          >
            <p
              className={`${raleway.className} font-extrabold text-black text-2xl`}
            >
              Question Palette
            </p>
            <div className={`w-full flex items-center justify-center py-2`}>
              <div className="grid grid-cols-3 gap-14">
                {questions.map((_, idx) => {
                  const isVisited = visited.has(idx);
                  const isAnswered = answers[idx] && answers[idx].length > 0;
                  const isCurrent = idx === currentIndex; // 👈 check current question

                  let bgColor = "";
                  let textColor = "";

                  if (isCurrent) {
                    // 🎯 Highlight current question (example: dark blue)
                    bgColor = "bg-[#2F447A]";
                    textColor = "text-white";
                  } else if (isVisited) {
                    bgColor = isAnswered ? "bg-[#4EADA7]" : "bg-[#DF6D6F]";
                    textColor = "text-white";
                  } else {
                    textColor = "text-black";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-8 h-8 ${poppins.className} font-normal text-xl rounded-sm flex items-center justify-center cursor-pointer ring-2 ring-[#A9A9A9] ${bgColor} ${textColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={`${
              width >= 800 ? "w-3/5" : "w-full h-full gap-8"
            } h-full flex flex-col justify-between gap-8 px-12 overflow-y-auto`}
          >
            <div className={`flex flex-col`}>
              <p
                className={`${abeezee.className} font-normal text-xl text-[#3B3B3B]`}
              >
                {questionnairePeriod} | {leg} Leg
              </p>
              <p
                className={`${raleway.className} font-extrabold text-2xl text-[#30263B]`}
              >
                {questionnaireTitle}
              </p>
            </div>

            <div className={`flex flex-col gap-4`}>
              <p
                className={`${inter.className} font-semibold text-lg text-[#242424]`}
              >
                {questions[currentIndex].questionText}
              </p>

              <div
                className={`w-full grid gap-4 ${
                  width > 1340 ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {questions[currentIndex].options.map((option, i) => {
                  const isSelected =
                    Array.isArray(answers[currentIndex]) &&
                    answers[currentIndex].includes(option);

                  return (
                    <div
                      key={i}
                      onClick={() => handleOptionClick(option)}
                      className={`bg-[#F5F5F7] rounded-full py-2 px-6 text-[#373240] ${
                        inter.className
                      } font-semibold text-base text-center w-fit cursor-pointer hover:scale-120  transition ${
                        isSelected ? "ring-2 ring-[#4EADA7]" : ""
                      }`
                    }
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`w-full flex justify-end`}>
              {showSubmit ? (
                <div
                  className={`w-fit px-12 py-2 rounded-md bg-[#4EADA7] ${inter.className} font-semibold text-white cursor-pointer`}
                  onClick={() => {
                    const unanswered = questions.filter((_, idx) => {
                      const ans = answers[idx];
                      return !ans || ans.length === 0;
                    });

                    if (unanswered.length > 0) {
                      setWarning(
                        "Please answer all questions before submitting."
                      );
                      setTimeout(() => {
                        setWarning("");
                      }, 2500);
                    } else {
                      setWarning("");
                      !isSubmitting ? setShowConfirmation(true) : undefined;
                    }
                  }}
                >
                  SUBMIT
                </div>
              ) : (
                <div
                  className={`w-fit px-12 py-2 rounded-md bg-[#4EADA7] ${inter.className} font-semibold text-white cursor-pointer`}
                  onClick={handleNext}
                >
                  NEXT
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showInitialPopup && (
        <Timepopup onProceed={handleProceed} onCancel={handleCancel} />
      )}
      <Commonquestions
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSubmit={handlePopupSubmit}
        onCancel={handleCancel}
      />
      {showConfirmation && (
        <Submitconfirmpop
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />
      )}
      {showAlert && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
            {alermessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
