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

import { type NavGroup, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CogIcon, Grip, GripHorizontal, LayoutGrid, PanelsTopLeftIcon, Users, VectorSquare } from 'lucide-react';

import { SdNavUser } from '@/layouts/subDomain/auth/sd-nav-user';
import bankai from '@/routes/bankai';
import subDomain from '@/routes/subDomain';

export function SdAppSidebar() {
    const { exhibition } = usePage<SharedData>().props;

    const mainNavGroups: NavGroup[] = [
        {
            title: "Platform",
            items: [
                {
                    title: 'Dashboard',
                    href: subDomain.dashboardPanel.dashboard({
                        exhibitionSlug: exhibition.subdomain
                    }).url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Global Settings',
                    href: subDomain.dashboardPanel.globalSettings.edit({
                        exhibitionSlug: exhibition.subdomain
                    }).url,
                    icon: CogIcon,
                },
                {
                    title: 'Page Settings',
                    icon: PanelsTopLeftIcon,
                    href: subDomain.dashboardPanel.pageSettings.list({
                        exhibitionSlug: exhibition.subdomain
                    }).url,
                },
                {
                    title: 'Users',
                    icon: Users,
                    href : '#',
                    children: [
                        {
                            title: 'Visitors',
                            href: subDomain.dashboardPanel.visitors.list({
                                exhibitionSlug: exhibition.subdomain
                            }).url,
                        },{
                            title: 'Exhibitors',
                            href: subDomain.dashboardPanel.exhibitors.list({
                                exhibitionSlug: exhibition.subdomain
                            }).url,
                        }
                    ]
                },
                {
                    title: 'Halls',
                    icon: VectorSquare,
                    href: subDomain.dashboardPanel.halls.list({
                        exhibitionSlug: exhibition.subdomain
                    }).url,
                },
                {
                    title: 'Stall Categories',
                    icon: Grip,
                    href: subDomain.dashboardPanel.halls.list({
                        exhibitionSlug: exhibition.subdomain
                    }).url,
                },
                {
                    title: 'Stalls',
                    icon: GripHorizontal,
                    href: subDomain.dashboardPanel.halls.list({
                        exhibitionSlug: exhibition.subdomain
                    }).url,
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
                <SdNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
