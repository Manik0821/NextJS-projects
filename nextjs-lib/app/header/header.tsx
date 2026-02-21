'use client';
import { useState } from 'react';
import './header.css';
import logo from "./../../public/next.svg";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Modern 2026 practice: Use dedicated handlers for clarity
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="header-container">

            <div className="header">
                <div className="header-menu">
                    {/* Accessibility: Use aria-expanded and role="button" for screen readers */}
                    <div
                        className="menu-logo"
                        onClick={openMenu}
                        role="button"
                        aria-label="Open menu"
                        aria-expanded={isMenuOpen}
                    >
                        &#x2630;
                    </div>
                </div>
                <div className="header-content">
                    <img className="header-logo" src={"/next.svg"} alt="Next logo" />
                    {/* <div className="header-title">Library</div> */}
                </div>
            </div>
        </div>
    );
};
