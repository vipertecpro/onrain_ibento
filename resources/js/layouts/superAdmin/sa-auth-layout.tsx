import '../../../css/app.css';
import SaAuthSplitLayout from '@/layouts/superAdmin/auth/sa-auth-split-layout';
import React from 'react';
import { initializeTheme } from '@/hooks/use-appearance';
initializeTheme();

export default function SaAuthLayout({
                                       children,
                                       title,
                                       description,
                                       ...props
                                   }: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <SaAuthSplitLayout title={title} description={description} {...props}>

            {children}
        </SaAuthSplitLayout>
    );
}
