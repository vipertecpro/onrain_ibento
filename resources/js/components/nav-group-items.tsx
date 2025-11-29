import { NavItem } from "@/types";
import { NavItemComponent } from '@/components/nav-item-component';

export function NavGroupItems({ items }: { items: NavItem[] }) {
    return (
        <>
            {items.map((item) => (
                <NavItemComponent key={item.title} item={item} />
            ))}
        </>
    );
}
