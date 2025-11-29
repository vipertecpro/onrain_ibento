import '../../../css/subDomainApp.css';
import { type BreadcrumbItem } from '@/types';
import SdAppSidebarLayout from '@/layouts/subDomain/auth/sd-app-sidebar-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
}

export default ({ children, title ,breadcrumbs, ...props }: AppLayoutProps) => (
    <SdAppSidebarLayout  breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        {children}
    </SdAppSidebarLayout>
);
