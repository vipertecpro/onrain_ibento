import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    exhibition: Exhibition;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}
export interface Exhibition {
    id: number;
    name: string;
    subdomain: string;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface ExhibitionsListProps {
    tableData: PaginatedResponse<Exhibition>;
    tableFilters: Record<string, string>;
}
export interface ExhibitionFormProps {
    formData: Exhibition;
    mode: 'create' | 'edit';
}
