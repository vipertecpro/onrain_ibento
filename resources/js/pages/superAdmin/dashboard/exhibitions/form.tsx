import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BreadcrumbItem, BuilderItem, Exhibition, ExhibitionFormProps, InputComponent, RegistrationField, RegistrationForm } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import React, { useState } from 'react';
import bankai from '@/routes/bankai';
import SaAppLayout from '@/layouts/superAdmin/sa-app-layout';
import SaExhibitionController from '@/actions/App/Http/Controllers/SuperAdmin/SaExhibitionController';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import RegistrationFormEditor from '@/pages/superAdmin/dashboard/exhibitions/registrationFormEditor';

export default function ExhibitionsForm({ formData, mode }: ExhibitionFormProps) {
    const data = formData ?? ({} as Exhibition);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: bankai.dashboard().url },
        { title: 'Exhibitions', href: bankai.exhibitions.list().url },
        { title: mode === 'create' ? 'Create Exhibition' : 'Edit Exhibition', href: '#' },
    ];
    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
    ];
    const [name, setName] = useState(data.name || "");
    const [subdomain, setSubdomain] = useState(data.subdomain || "");
    const [selectedStatus, setSelectedStatus] = useState(formData?.status ?? '');
    const protocol = typeof window !== "undefined" ? window.location.protocol.replace(":", "") : "https";
    const appDomain = import.meta.env.VITE_APP_DOMAIN;
    const [copy, isCopied] = useCopyToClipboard();

    /**
     * Build a safe initial builder schema for the editor.
     * - If server already returned a proper builder_schema array, use it.
     * - If server returned old `fields` array (no `id`), map them to InputComponents.
     */
    const builderInitial: BuilderItem[] = React.useMemo(() => {
        const registrationForm: RegistrationForm | null =
            formData?.registration_form ?? null;

        if (!registrationForm) return [];

        //
        // CASE 1: Server already returns new BuilderItem[] (correct format)
        //
        if (Array.isArray(registrationForm.builder_schema)) {
            return registrationForm.builder_schema.map((item) => {
                // ensure id exists
                if (!item.id) {
                    const newId = "imported-" + crypto.randomUUID();
                    return { ...item, id: newId };
                }
                return item;
            });
        }

        //
        // CASE 2: Server is still returning old RegistrationField[] structure
        //
        if (Array.isArray(registrationForm.fields)) {
            return registrationForm.fields.map((field: RegistrationField) => {
                const fieldId = field.key ?? crypto.randomUUID();

                const inputItem: InputComponent = {
                    id: String(fieldId),
                    type: "input",
                    label: field.label ?? String(field.key ?? "Field"),
                    placeholder: "",
                    required: Boolean(field.required),
                };

                return inputItem as BuilderItem;
            });
        }

        return [];
    }, [formData]);

    return (
        <SaAppLayout breadcrumbs={breadcrumbs}>
            <Head title={mode === 'create' ? 'Create Exhibition' : 'Edit Exhibition'} />
            <Form
                {...(
                    mode === 'create'
                        ? SaExhibitionController.store.form()
                        : SaExhibitionController.update.form(data.id!)
                )}
                options={{
                    preserveScroll: true,
                }}
                resetOnSuccess={mode === 'create'}
            >
                {({ errors, processing, recentlySuccessful }) => (
                    <Card className="m-2 gap-2 divide-y rounded-md p-0 py-2 shadow-none">
                        <CardContent className="p-2">
                            <ScrollArea className="relative h-[calc(100vh-9.8rem)] w-full overflow-y-auto">
                                <div className="grid grid-cols-1 gap-4 2xl:grid-cols-1">
                                    <Card className="rounded-md shadow-none p-0 ">
                                        <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-2 p-4">
                                            <div className="grid gap-2 col-span-2">
                                                <Label>Status</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !selectedStatus && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {selectedStatus
                                                                ? statusOptions.find((s) => s.value === selectedStatus)?.label
                                                                : "Select status"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search statuses..." />
                                                            <CommandList>
                                                                <CommandEmpty>No status found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {statusOptions.map((s) => (
                                                                        <CommandItem
                                                                            key={s.value}
                                                                            value={s.value}
                                                                            onSelect={() => {
                                                                                setSelectedStatus(s.value);
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    selectedStatus === s.value ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {s.label}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <input type="hidden" name="status" value={selectedStatus} />
                                                <InputError message={errors.status} />
                                            </div>
                                            <div className="grid gap-2 col-span-2">
                                                <Label htmlFor="name">Name</Label>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        name="name"
                                                        value={name}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setName(value);
                                                            const slug = value
                                                                .toLowerCase()
                                                                .trim()
                                                                .replace(/[^a-z0-9]+/g, '-')
                                                                .replace(/^-+|-+$/g, '');
                                                            setSubdomain(slug);
                                                        }}
                                                        placeholder="Enter name of the exhibition"
                                                    />
                                                </InputGroup>
                                                <InputError message={errors.name} />
                                            </div>
                                            <div className="grid gap-2 grid-cols-1 xl:grid-cols-2 col-span-2">
                                                <div className={'grid gap-2'}>
                                                    <Label htmlFor="subdomain">Subdomain For Visitors</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <InputGroupText>{protocol}://</InputGroupText>
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            name="subdomain"
                                                            type="text"
                                                            value={subdomain}
                                                            onChange={(e) => setSubdomain(e.target.value)}
                                                            placeholder={'Enter subdomain'}
                                                        />
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupText>{appDomain}</InputGroupText>
                                                            <InputGroupButton
                                                                aria-label="Copy"
                                                                title="Copy"
                                                                size="icon-xs"
                                                                onClick={() => {
                                                                    const url = `${protocol}://${subdomain}.${appDomain}`;
                                                                    copy(url);
                                                                }}
                                                                className={'cursor-pointer'}
                                                            >
                                                                {isCopied ? <IconCheck /> : <IconCopy />}
                                                            </InputGroupButton>
                                                        </InputGroupAddon>

                                                    </InputGroup>
                                                    <InputError message={errors.subdomain} />
                                                </div>
                                                <div className={'grid gap-2'}>
                                                    <Label htmlFor="subdomain">Subdomain For Admin/Exhibitor</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <InputGroupText>{protocol}://</InputGroupText>
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            name="subdomainForAdminExhibitor"
                                                            type="text"
                                                            value={subdomain}
                                                            onChange={(e) => setSubdomain(e.target.value)}
                                                            placeholder={'Enter subdomain'}
                                                            disabled
                                                        />
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupText>{appDomain}/dashboardPanel</InputGroupText>
                                                            <InputGroupButton
                                                                aria-label="Copy"
                                                                title="Copy"
                                                                size="icon-xs"
                                                                onClick={() => {
                                                                    const url = `${protocol}://${subdomain}.${appDomain}/dashboardPanel`;
                                                                    copy(url);
                                                                }}
                                                                className={'cursor-pointer'}
                                                            >
                                                                {isCopied ? <IconCheck /> : <IconCopy />}
                                                            </InputGroupButton>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    <InputError message={errors.subdomain} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="rounded-md shadow-none p-0 ">
                                        <CardContent className="p-4">
                                            <RegistrationFormEditor initial={builderInitial} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end gap-4">
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>

                            <Button variant={'secondary'} size={'sm'} className="cursor-pointer" asChild>
                                <Link href={bankai.exhibitions.list().url}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button disabled={processing} size="sm" className="cursor-pointer">
                                Submit
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </Form>
        </SaAppLayout>
    );
}
