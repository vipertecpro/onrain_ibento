import React from "react";
import { Form, usePage } from "@inertiajs/react";
import SdAppLayout from "@/layouts/subDomain/sd-app-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Transition } from "@headlessui/react";
import subDomain from "@/routes/subDomain";

import { GlobalSettingsPageProps } from "@/types";
export default function PageSettingsFrom({ pageTitle }: { pageTitle: string }) {
    const { exhibition } = usePage<GlobalSettingsPageProps>().props;

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
                    title: "Page Settings",
                    href: subDomain.dashboardPanel.pageSettings.list.url({
                        exhibitionSlug: exhibition.subdomain,
                    }),
                },
            ]}
        >
            <Form
                {...subDomain.dashboardPanel.pageSettings.update.form({
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
