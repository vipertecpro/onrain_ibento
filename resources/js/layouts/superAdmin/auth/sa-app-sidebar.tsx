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

import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, LayoutList } from 'lucide-react';

import bankai from '@/routes/bankai';
import { SaNavUser } from '@/layouts/superAdmin/auth/sa-nav-user';

export function SaAppSidebar() {

    const mainNavGroups: NavGroup[] = [
        {
            title: "Platform",
            items: [
                {
                    title: 'Dashboard',
                    href: bankai.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Exhibitions',
                    href: bankai.exhibitions.list().url,
                    icon: LayoutList,
                },
            ]
        }
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
                <NavMain groups={mainNavGroups} />
            </SidebarContent>
            <SidebarFooter>
                <SaNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
