import { ReactNode } from "react";

interface TabPanelProps {
  value: string;
  activeTab: string;
  children: ReactNode;
}

export default function TabPanel({
  value,
  activeTab,
  children,
}: TabPanelProps) {
  if (value !== activeTab) return null;

  return (
    <div
      className="
    tab-panel
    rounded-2xl
    bg-white
    p-1
    shadow-sm"
    >
      {children}
    </div>
  );
}