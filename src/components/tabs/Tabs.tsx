"use client";

import { ReactNode } from "react";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  children,
}: TabsProps) {
  return (
    <div className="tabs-container space-y-6">

      <div className="tabs-navigation flex justify-center">

        <div
          className="
            tabs-wrapper
            flex w-full rounded-full
            bg-white p-1 shadow-sm

            md:w-1/2
          "
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`
                tab-button
                flex-1 rounded-full py-2 text-sm transition

                ${
                  activeTab === tab.value
                    ? "bg-black text-white"
                    : "text-slate-500"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}