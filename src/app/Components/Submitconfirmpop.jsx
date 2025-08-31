"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const Submitconfirmpop = ({ onCancel, onConfirm }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center text-gray-800">
          Confirm Submission
        </h2>
        <p className="text-gray-600 text-center">
          Are you sure you want to submit the Questionnaire?
        </p>
        <div className="flex justify-between mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Submitconfirmpop;
