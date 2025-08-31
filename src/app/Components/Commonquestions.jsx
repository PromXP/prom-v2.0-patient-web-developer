"use client";
import React, { useState, useEffect, use } from "react";
import { createPortal } from "react-dom";

import { Raleway, Inter, Poppins, ABeeZee, Roboto } from "next/font/google";

import "@/app/globals.css";

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

const Commonquestions = ({ isOpen, onClose, onSubmit }) => {
  const [filledBy, setFilledBy] = useState("Self");
  const [whoFilled, setWhoFilled] = useState("");
  const [otherPain, setOtherPain] = useState("No");
  const [painDetails, setPainDetails] = useState("");

  const handleSubmit = () => {
    // Basic validation
    if (!filledBy) {
      showWarning("Please select who filled the form.");
      return;
    }

    if (filledBy === "Other" && !whoFilled.trim()) {
      showWarning("Please specify who filled the form.");
      return;
    }

    if (!otherPain) {
      showWarning("Please select if there is any pain.");
      return;
    }

    if (otherPain === "Yes" && !painDetails.trim()) {
      showWarning("Please provide pain details.");
      return;
    }

    onSubmit({
      filledBy,
      whoFilled: filledBy === "Other" ? whoFilled : "",
      otherPain,
      painDetails: otherPain === "Yes" ? painDetails : "",
    });
    onClose();
  };

   const [showAlert, setshowAlert] = useState(false);
      const [alermessage, setAlertMessage] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);
  
  if (!isOpen || !mounted) return null;
  return createPortal (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
      }}
    >
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl flex flex-col gap-5">
        <h2 className={`${roboto.className} text-xl font-medium text-start text-black`}>
          Fill to continue
        </h2>

        {/* Question 1 */}
        <div className={`${inter.className} font-normal text-black flex flex-col gap-2`}>
          <label>
            Is the questionnaire filled by you or someone else?
          </label>
          <select
            value={filledBy}
            onChange={(e) => setFilledBy(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-black"
          >
            <option value="Self">Self</option>
            <option value="Other">Someone Else</option>
          </select>

          {filledBy === "Other" && (
            <input
              type="text"
              placeholder="Who filled it?"
              value={whoFilled}
              onChange={(e) => setWhoFilled(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mt-2 text-black"
            />
          )}
        </div>

        {/* Question 2 */}
        <div className={`${inter.className} font-normal text-black flex flex-col gap-2`}>
          <label className="font-medium text-gray-700">
            Do you feel any other pain in the body?
          </label>
          <select
            value={otherPain}
            onChange={(e) => setOtherPain(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-black"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>

          {otherPain === "Yes" && (
            <input
              type="text"
              placeholder="Please describe the pain"
              value={painDetails}
              onChange={(e) => setPainDetails(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mt-2 text-black"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Submit
          </button>
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
    </div>,
    document.body
  );
}

export default Commonquestions