// TitleDisplay.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTitleStore } from '../../lib/store';
import { Button } from '../../lib/Button/Button';

export const TitleDisplay = () => {
    const pathname = usePathname() || '';
    const { title, subTitle, subHeading, updateByPath } = useTitleStore();

    // Fixed the typo: changed 'ai-transscript' to 'ai-transcript'
    const isHidden = pathname.toLowerCase().includes('ai-transcript') || pathname.toLowerCase().includes('weather');

    useEffect(() => {
        if (isHidden) return;
        updateByPath(pathname);
    }, [pathname, updateByPath, isHidden]);

    // Completely unmounts the component from the DOM
    if (isHidden) {
        return null;
    }

    return (
        <div className="page-title">
            <div className="page-heading">{title}</div>
            {subHeading !== '' && <div className="page-subheading">{subHeading}</div>}
            {subTitle !== '' && (<Button type="tertiary" value={subTitle} click={false} disabled={false}></Button>)}
        </div>
    );
};
