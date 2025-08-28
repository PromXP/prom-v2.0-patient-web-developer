"use client";
import React, { useState, useEffect, use } from "react";
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
 
 const Timepopup = ({onProceed}) => {
   return (
      <div className="fixed inset-0 flex items-center justify-center z-50"
    style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
      }}>
      <div className="bg-white rounded-lg p-8 w-[90%] max-w-md flex flex-col items-center gap-6 shadow-2xl">
        <h2 className={`${roboto.className} text-xl font-medium text-center text-black`}>
          Please Note
        </h2>
        <p className={` ${roboto.className} text-gray-600 font-normal text-center  text-base`}>
          This questionnaire takes approximately <span className="font-semibold">15 minutes</span> to complete.
        </p>
        <button
          onClick={onProceed}
          className={`${roboto.className} font-normal mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full transition duration-300 cursor-pointer`}
        >
          Proceed
        </button>
      </div>
    </div>
   )
 }
 
 export default Timepopup