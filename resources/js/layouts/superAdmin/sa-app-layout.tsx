import '../../../css/app.css';
import { type BreadcrumbItem } from '@/types';
import SaAppSidebarLayout from '@/layouts/superAdmin/auth/sa-app-sidebar-layout';
import { initializeTheme } from '@/hooks/use-appearance';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}
initializeTheme();

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <SaAppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </SaAppSidebarLayout>
);
