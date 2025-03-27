import React from "react";
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

function FaqItem({ question, answer, isActive, onToggle }) {
  return (
    <div className="w-full h-min text-black">
      <div
        className="flex justify-between items-center p-4 transition-transform transform hover:scale-105 hover:bg-[#34D399] duration-300 cursor-pointer"
        onClick={onToggle}
      >
        <button
          className={`w-full text-left font-medium 
          }`}
        >
          <h3 className="text-xl">{question}</h3>
        </button>
        <p className="transition-transform">
          {isActive ? (
            <MdOutlineKeyboardArrowUp className="text-[25px] font-bold" />
          ) : (
            <MdKeyboardArrowDown className="text-[25px] font-bold" />
          )}
        </p>
      </div>
      {isActive && <p className="p-4 text-sm text-gray-700">{answer}</p>}
    </div>
  );
}

export default FaqItem;
