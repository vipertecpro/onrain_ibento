import '../../../css/subDomainApp.css';
import SdAuthSplitLayout from '@/layouts/subDomain/auth/sd-auth-split-layout';
import React from 'react';
import { Head } from '@inertiajs/react';

export default function SdAuthLayout({
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
        <SdAuthSplitLayout title={title} description={description} {...props}>
            <Head title={title} />
            {children}
        </SdAuthSplitLayout>
    );
}
