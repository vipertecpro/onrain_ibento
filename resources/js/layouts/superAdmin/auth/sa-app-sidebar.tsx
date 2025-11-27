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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { SaNavUser } from '@/layouts/superAdmin/auth/sa-nav-user';
import bankai from '@/routes/bankai';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: bankai.dashboard().url,
        icon: LayoutGrid,
    },{
        title: 'Exhibitions',
        href: bankai.exhibitions.list().url,
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
];

export function SaAppSidebar() {
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
                <SaNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
