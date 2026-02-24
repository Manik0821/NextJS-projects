import React, { useState } from "react";
import './Tabs.css';
// import { Link } from "react-router-dom";

export const TabsModule = () => {
    // 1. State to track the active tab index
    const [activeTab, setActiveTab] = useState(0);

    // 2. Data structure for your tabs
    const tabsData = [
        { label: "Overview", content: <p>General project overview for 2026.</p> },
        { label: "Features", content: <p>New features including React Server Components.</p> },
        { label: "Settings", content: <p>Update your module configurations here.</p> }
    ];

    return (
        <div className="tabs-cont">
            {/* Tab Navigation List */}
            <div className="tab-list" role="tablist" aria-label="Module Tabs">
                {tabsData.map((tab, index) => (
                    <button
                        key={index}
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`panel-${index}`}
                        id={`tab-${index}`}
                        className={`tab-btn ${activeTab === index ? "active" : ""}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Body */}
            <div 
                className="tab-body" 
                role="tabpanel" 
                id={`panel-${activeTab}`} 
                aria-labelledby={`tab-${activeTab}`}
            >
                {tabsData[activeTab].content}
            </div>
            {/* <Link to="/" style={{ marginLeft: '10px' }}>Back Home</Link> */}
        </div>
    );
};
