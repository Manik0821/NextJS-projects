'use client';

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { features } from "@/app/features/feature-list"; // Clean relative step-out path
import './fullScreenModal.css';

type FullScreenModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (!isOpen) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            ref={modalRef}
            className={`modal-container ${isOpen ? 'is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-hidden={!isOpen}
            style={{ pointerEvents: isOpen ? 'all' : 'none' }}
            tabIndex={-1}
        >
            <div className="modal-overlay" onClick={onClose} />

            <div className="modal-window">
                <header className="modal-header">
                    <h2 id="modal-title" className="modal-title">{title}</h2>
                    <button onClick={onClose} className="close-button" aria-label="Close modal">
                        &times;
                    </button>
                </header>

                <main className="modal-content">
                    <div className="modal-navigation-tabs">
                        <nav className="tab-buttons">
                            {/* Dynamically renders navigation links matching display rules */}
                            {features
                              .filter((feature) => feature.display) // Filter out hidden links
                              .map((feature, index) => (
                                <Link 
                                    key={index} 
                                    href={feature.path} 
                                    className="nav-tab-item" 
                                    onClick={onClose}
                                >
                                    {feature.title}
                                </Link>
                            ))}
                        </nav>
                        <div className="tab-details">
                            {children || <p>Welcome! Select an option above to navigate.</p>}
                        </div>
                        <button className="secondary-close-btn" onClick={onClose}>
                            Back to Page
                        </button>
                    </div>
                </main>
            </div>
        </div>,
        document.body
    );
};
