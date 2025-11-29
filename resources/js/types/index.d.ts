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
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    exhibition: Exhibition;
    auth: Auth;
    sidebarOpen: boolean;
    exGlobalSettings: ExGlobalSettings;
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
export interface RegistrationField {
    key: string;
    label?: string;
    required?: boolean;
}

export interface RegistrationForm {
    id: number;
    exhibition_id: number;
    builder_schema?: BuilderItem[] | null;
    fields?: RegistrationField[];
}

export interface Exhibition {
    id: number;
    name: string;
    subdomain: string;
    status: string;
    registration_form?: RegistrationForm | null;
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
export type BuilderComponentType =
    | "text"
    | "input"
    | "inputGroup"
    | "select";

export interface BuilderItemBase {
    id: string;
    type: BuilderComponentType;
}

export interface TextComponent extends BuilderItemBase {
    type: "text";
    level: "h1" | "h2" | "h3" | "h4";
    align: "left" | "center" | "right";
    content: string;
}

export interface InputComponent extends BuilderItemBase {
    type: "input";
    label: string;
    placeholder?: string;
    required?: boolean;
}

export interface InputGroupComponent extends BuilderItemBase {
    type: "inputGroup";
    label: string;
    inputs: InputComponent[];
}
export interface SelectOption {
    id: string;
    value: string;
}

export interface SelectComponent extends BuilderItemBase {
    type: "select";
    label: string;
    options: SelectOption[];
    required?: boolean;
}

export type BuilderItem =
    | TextComponent
    | InputComponent
    | InputGroupComponent
    | SelectComponent;

export type ExGlobalSettings = Record<string, string | null>;
export interface GlobalSettingField {
    label: string;
    type: "file" | "select";
    options?: Record<string, string>;
}

export interface GlobalSettingValue {
    value: string | null;
    url: string | null;
}

export interface GlobalSettingsPageProps extends SharedData {
    fields: Record<string, GlobalSettingField>;
    settings: Record<string, GlobalSettingValue>;
}
