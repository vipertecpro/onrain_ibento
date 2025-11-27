import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { SdNavUser } from '@/layouts/subDomain/auth/sd-nav-user';
import bankai from '@/routes/bankai';
import subDomain from '@/routes/subDomain';
export function SdAppSidebar() {
    const { exhibition } = usePage<SharedData>().props;
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: subDomain.dashboardPanel.dashboard({
                exhibitionSlug : exhibition.subdomain
            }).url,
            icon: LayoutGrid,
        }
    ];

    const footerNavItems: NavItem[] = [
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={bankai.dashboard().url} prefetch>
                                LOGO HERE
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <SdNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
