import React from 'react';
import InputAssessment from '../modules/pages/InputAssessment';
export default function Result({ score, total, onReset }) {

  return (
    <>
    <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        Your Score: {score} / {total}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 bg-[#88cd65] cursor-pointer text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
    <div className="mt-8">
      <InputAssessment />
    </div>
    </>
  );
}