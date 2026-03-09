// TitleDisplay.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTitleStore } from '../lib/store';

export const TitleDisplay = () => {
    const pathname = usePathname();
    const { title, subTitle, updateByPath } = useTitleStore();

    useEffect(() => {
        updateByPath(pathname);
    }, [pathname, updateByPath]);

    return (
        <div className="page-title">
            <div className="page-heading">{title}</div>
            {subTitle && <div className="page-subheading">{subTitle}</div>}
        </div>
    );
};
