
import { type BreadcrumbItem } from '@/types';
import SaAppSidebarLayout from '@/layouts/superAdmin/auth/sa-app-sidebar-layout';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <SaAppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </SaAppSidebarLayout>
);
