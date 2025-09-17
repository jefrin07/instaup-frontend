import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Posts", "Stories"];

  return (
    <div className="flex justify-center gap-6 mt-8 border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          aria-selected={activeTab === tab}
          className={`px-4 py-2 font-medium transition-colors duration-200 focus:outline-none ${
            activeTab === tab
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
