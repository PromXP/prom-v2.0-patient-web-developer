"use client";
import React, { useState, useEffect, use } from "react";

import { Raleway, Inter, Poppins, ABeeZee, Roboto } from "next/font/google";

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

const Terms = ({ isTermsopen, isTermsclose }) => {
  const [accepted, setAccepted] = useState(false);

  const handleProceed = () => {
    sessionStorage.setItem("terms",1);
    isTermsclose();
  };

  if (!isTermsopen) return null;

  return (
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
          className={`${roboto.className} font-medium text-lg h-full p-4 mb-4   text-gray-700 overflow-y-auto max-h-[600px] inline-scroll`}
        >
          <p>
            Welcome to XoLabs Pvt Ltd. By accessing or using our
            Patient-Reported Outcome Measures (PROM) platform, you agree to the
            following Terms and Conditions. Please read them carefully before
            using the platform.
            <br />
            <br />
            <strong>1. Acceptance of Terms</strong>
            <br />
            By registering for and/or using this website, you agree to be bound
            by these Terms and Conditions and our Privacy Policy. If you do not
            agree, please do not use the service.
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
            You must be at least 18 years old, or have legal guardian consent if
            under 18, to use this platform. Use of the platform is limited to
            individuals authorized by a participating healthcare provider or
            institution.
            <br />
            <br />
            <strong>4. Data Collection and Use</strong>
            <br />
            By using the platform, you consent to the collection, use, storage,
            and sharing of your personal and health information as outlined in
            our Privacy Policy. This may include:
            <br />- Questionnaire responses
            <br />- Contact and identification information
            <br />- Usage data
            <br />
            All data is handled in compliance with applicable data protection
            laws, including [e.g., HIPAA if in the US, or applicable national
            regulations].
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
            We implement appropriate technical and organizational measures to
            protect your data.
            <br />
            <br />
            <strong>7. No Medical Advice</strong>
            <br />
            The platform may provide general information and automated feedback
            based on your input. This content is not a substitute for
            professional medical advice. Always consult your healthcare provider
            for medical concerns.
            <br />
            <br />
            <strong>8. Service Modifications</strong>
            <br />
            We may update, suspend, or discontinue the service (or parts of it)
            at any time without notice. We are not liable for any changes or
            interruptions.
            <br />
            <br />
            <strong>9. Intellectual Property</strong>
            <br />
            All content, branding, and technology on this platform are owned by
            XoLabs Pvt Ltd and protected by
            copyright and trademark laws.
            <br />
            <br />
            <strong>10. Termination</strong>
            <br />
            We may suspend or terminate your access if you violate these Terms.
            You may also stop using the service at any time.
            <br />
            <br />
            <strong>11. Limitation of Liability</strong>
            <br />
            We are not liable for any indirect, incidental, or consequential
            damages resulting from your use of the service. Use is at your own
            risk.
            <br />
            <br />
            <strong>12. Governing Law</strong>
            <br />
            These Terms are governed by the laws of India. Any
            disputes shall be resolved in the courts of Chennai, Tamil Nadu.
            <br />
            <br />
            <strong>13. Changes to Terms</strong>
            <br />
            We may update these Terms occasionally. Continued use after such
            changes indicates your acceptance. The latest version will always be
            posted on the website.
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
              onClick={handleProceed}
              className={`${raleway.className} font-semibold text-lg px-12 py-2 rounded-md  bg-[#2F447A] text-white cursor-pointer`}
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
  );
};

export default Terms;
