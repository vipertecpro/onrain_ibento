import {
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible";

import { Link, usePage } from "@inertiajs/react";
import { NavItem } from "@/types";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function NavItemComponent({ item }: { item: NavItem }) {
    const { url } = usePage();

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isActive = item.href === url;
    const isChildActive =
        hasChildren && item.children!.some((c) => c.href === url);

    // If child is active, parent should open
    const [open, setOpen] = useState(isChildActive);

    useEffect(() => {
        if (isChildActive) setOpen(true);
    }, [isChildActive]);

    if (!hasChildren) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href!}>
                        {item.icon && <item.icon className="mr-2" />}
                        {item.title}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <Collapsible asChild open={open} onOpenChange={setOpen}>
            <SidebarMenuItem>
                {/* Parent button */}
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        {item.icon && <item.icon className="mr-2" />}
                        {item.title}
                        <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform ${
                                open ? "rotate-180" : ""
                            }`}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Child items */}
                <CollapsibleContent>
                    <div className="ml-6 mt-1 space-y-1">
                        {item.children!.map((child) => (
                            <SidebarMenuItem key={child.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={child.href === url}
                                >
                                    <Link href={child.href!}>
                                        {child.title}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
