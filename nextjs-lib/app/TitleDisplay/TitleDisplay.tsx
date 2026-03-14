// TitleDisplay.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTitleStore } from '../lib/store';
import { Button } from '../Button/Button';

export const TitleDisplay = () => {
    const pathname = usePathname();
    const { title, subTitle, subHeading, updateByPath } = useTitleStore();

    useEffect(() => {
        updateByPath(pathname);
    }, [pathname, updateByPath]);

    return (
        <div className="page-title">
            <div className="page-heading">{title}</div>
            {subHeading !=='' && <div className="page-subheading">{subHeading}</div>}
            {subTitle !=='' && (<Button type="tertiary" value={subTitle} click={false} disabled={false}></Button>)}
        </div>
    );
};
