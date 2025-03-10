import React from "react";

const Input = ({ placeholder, value, onChange, onSend }) => {
  return (
    <div className="flex items-center p-1 border-t shadow-lg rounded-b-lg">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 p-3 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
      />
      <button
        onClick={onSend}
        className="ml-3 px-4 py-2 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-all"
      >
        Send
      </button>
    </div>
  );
};

export default Input;
