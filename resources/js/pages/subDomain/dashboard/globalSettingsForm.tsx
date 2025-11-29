import React from "react";
import { Form, router, usePage } from "@inertiajs/react";
import SdAppLayout from "@/layouts/subDomain/sd-app-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import InputError from "@/components/input-error";
import { Trash2, ChevronsUpDown, Check, EyeIcon } from 'lucide-react';
import { Transition } from "@headlessui/react";
import subDomain from "@/routes/subDomain";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { GlobalSettingsPageProps } from "@/types";
export default function GlobalSettingsForm({ pageTitle }: { pageTitle: string }) {
    const { exhibition, settings } = usePage<GlobalSettingsPageProps>().props;
    const [loginStatusOpen, setLoginStatusOpen] = React.useState(false);
    const [selectedLoginStatus, setSelectedLoginStatus] = React.useState(
        settings?.is_login_active?.value ?? ""
    );
    return (
        <SdAppLayout
            title={pageTitle}
            breadcrumbs={[
                {
                    title: "Dashboard",
                    href: subDomain.dashboardPanel.dashboard.url({
                        exhibitionSlug: exhibition.subdomain,
                    }),
                },
                {
                    title: "Global Settings",
                    href: subDomain.dashboardPanel.globalSettings.edit.url({
                        exhibitionSlug: exhibition.subdomain,
                    }),
                },
            ]}
        >
            <Form
                {...subDomain.dashboardPanel.globalSettings.update.form({
                    exhibitionSlug: exhibition.subdomain,
                })}
                encType="multipart/form-data"
                options={{ preserveScroll: true }}
            >
                {(formState) => (
                    <Card className="m-2 rounded-md shadow-none py-2 px-0 divide-y gap-2">
                        <CardContent className="py-2 px-2">
                            <ScrollArea className="h-[calc(100vh-10rem)]">
                                <div className={'grid grid-cols-1 xl:grid-cols-2 gap-3'}>
                                    <Card className={'rounded-md shadow-none py-2 px-0 divide-y [.border-b]:pb-2 gap-2'}>
                                        <CardHeader  className={'p-2 [.border-b]:pb-2'}>
                                            <CardTitle>Site Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-2 px-2 ">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <Label>Exhibition Logo</Label>
                                                    <InputGroup>
                                                        <InputGroupInput type="file" name="ex_logo" />
                                                        {settings.ex_logo?.url && (
                                                            <>
                                                                <InputGroupAddon align="inline-end">
                                                                    <a href={settings.ex_logo.url} target="_blank" className={'cursor-pointer'}>
                                                                        <EyeIcon size={18} />
                                                                    </a>
                                                                </InputGroupAddon>
                                                                <InputGroupAddon align="inline-end">
                                                                    <Button
                                                                        type={'button'}
                                                                        variant={'link'}
                                                                        size={'sm'}
                                                                        className={'cursor-pointer'}
                                                                        onClick={() =>
                                                                            router.delete(
                                                                                subDomain.dashboardPanel.globalSettings.deleteFile.url({
                                                                                    exhibitionSlug: exhibition.subdomain,
                                                                                }),{
                                                                                    data : {
                                                                                        key : 'ex_logo'
                                                                                    }
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 size={18}/>
                                                                    </Button>
                                                                </InputGroupAddon>
                                                            </>
                                                        )}
                                                    </InputGroup>
                                                    <InputError message={formState.errors.ex_logo} />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label>Exhibition Favicon</Label>
                                                    <InputGroup>
                                                        <InputGroupInput type="file" name="ex_favicon" />
                                                        {settings.ex_favicon?.url && (
                                                            <>
                                                                <InputGroupAddon align="inline-end">
                                                                    <a href={settings.ex_favicon.url} target="_blank" className={'cursor-pointer'}>
                                                                        <EyeIcon size={18} />
                                                                    </a>
                                                                </InputGroupAddon>
                                                                <InputGroupAddon align="inline-end">
                                                                    <Button
                                                                        type={'button'}
                                                                        variant={'link'}
                                                                        size={'sm'}
                                                                        className={'cursor-pointer'}
                                                                        onClick={() =>
                                                                            router.delete(
                                                                                subDomain.dashboardPanel.globalSettings.deleteFile.url({
                                                                                    exhibitionSlug: exhibition.subdomain,
                                                                                }),{
                                                                                    data : {
                                                                                        key : 'ex_favicon'
                                                                                    }
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 size={18}/>
                                                                    </Button>
                                                                </InputGroupAddon>
                                                            </>
                                                        )}
                                                    </InputGroup>
                                                    <InputError message={formState.errors.ex_favicon} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className={'rounded-md shadow-none py-2 px-0 divide-y [.border-b]:pb-2 gap-2'}>
                                        <CardHeader className={'p-2'}>
                                            <CardTitle>Login Page Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-2 px-2">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <Label>Login Side Banner</Label>
                                                    <InputGroup>
                                                        <InputGroupInput type="file" name="login_side_banner" />
                                                        {settings.login_side_banner?.url && (
                                                            <>
                                                                <InputGroupAddon align="inline-end">
                                                                    <a href={settings.login_side_banner.url} target="_blank" className={'cursor-pointer'}>
                                                                        <EyeIcon size={18} />
                                                                    </a>
                                                                </InputGroupAddon>
                                                                <InputGroupAddon align="inline-end">
                                                                    <Button
                                                                        type={'button'}
                                                                        variant={'link'}
                                                                        size={'sm'}
                                                                        className={'cursor-pointer'}
                                                                        onClick={() =>
                                                                            router.delete(
                                                                                subDomain.dashboardPanel.globalSettings.deleteFile.url({
                                                                                    exhibitionSlug: exhibition.subdomain,
                                                                                }),{
                                                                                    data : {
                                                                                        key : 'login_side_banner'
                                                                                    }
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 size={18}/>
                                                                    </Button>
                                                                </InputGroupAddon>
                                                            </>
                                                        )}
                                                    </InputGroup>
                                                    <InputError message={formState.errors.login_side_banner} />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label>Is Login Active?</Label>
                                                    <Popover open={loginStatusOpen} onOpenChange={setLoginStatusOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between"
                                                            >
                                                                {selectedLoginStatus
                                                                    ? selectedLoginStatus
                                                                    : "Select status"}
                                                                <ChevronsUpDown size={16} className="opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search..." />
                                                                <CommandEmpty>No results</CommandEmpty>
                                                                <CommandGroup>
                                                                    {["yes", "no"].map((status) => (
                                                                        <CommandItem
                                                                            key={status}
                                                                            onSelect={() => {
                                                                                setSelectedLoginStatus(status);
                                                                                setLoginStatusOpen(false);
                                                                            }}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Check
                                                                                size={16}
                                                                                className={cn(
                                                                                    "mr-2",
                                                                                    selectedLoginStatus === status
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {status}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <input type="hidden" name="is_login_active" value={selectedLoginStatus} />
                                                    <InputError message={formState.errors.is_login_active} />
                                                </div>
                                                {(selectedLoginStatus === "no" || selectedLoginStatus === "") && (
                                                    <div className="flex flex-col gap-2">
                                                        <Label>Inactive Login Page Text</Label>
                                                        <InputGroup>
                                                            <InputGroupInput
                                                                type="text"
                                                                name="inactive_login_text"
                                                                defaultValue={settings.inactive_login_text?.value || "Login will be active after sometime. Please come back later."}
                                                                placeholder="Enter message shown when login is inactive"
                                                            />
                                                        </InputGroup>
                                                        <InputError message={formState.errors.inactive_login_text} />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <CardFooter className="flex items-center justify-end gap-4 px-2 [.border-t]:pt-2">
                            <Transition
                                show={formState.recentlySuccessful}
                                enter="transition-opacity duration-300"
                                enterFrom="opacity-0"
                                leave="transition-opacity duration-300"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>

                            <Button disabled={formState.processing} size="sm">
                                Save Settings
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </Form>
        </SdAppLayout>
    );
}
