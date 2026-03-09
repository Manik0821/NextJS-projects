'use client';
import { useState } from 'react';
import { useSidebarStore } from '../lib/store';
import './header.css';
import { FullScreenModal } from './FullScreenModal/fullScreenModal';

export const Header = () => {
    const { isOpen, toggle } = useSidebarStore();

    return (
        <div className="header-container">

            <div className="header">
                <div className="header-menu">
                    {/* Accessibility: Use aria-expanded and role="button" for screen readers */}
                    <div
                        className="menu-logo"
                        onClick={toggle}
                        role="button"
                        aria-label="Open menu"
                        aria-expanded={isOpen}
                    >
                        &#x2630;
                    </div>
                </div>
                <div className="header-content">
                    <img className="header-logo" src={"/next.svg"} alt="Next logo" />
                    {/* <div className="header-title">Library</div> */}
                </div>
                <FullScreenModal isOpen={isOpen} onClose={toggle} title="Menu">

                </FullScreenModal>
            </div>
        </div>
    );
};
