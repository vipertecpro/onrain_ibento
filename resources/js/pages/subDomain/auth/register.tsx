import { Form, Head, Link } from '@inertiajs/react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from '@/components/ui/select';
import type {
    BuilderItem,
    Exhibition,
    TextComponent,
    InputComponent,
    InputGroupComponent,
    SelectComponent,
} from "@/types";

import { useState } from "react";
import InputError from '@/components/input-error';
import subDomain from '@/routes/subDomain';
import SdAuthLayout from '@/layouts/subDomain/sd-auth-layout';
import { Separator } from '@/components/ui/separator';

interface RegisterProps {
    pageTitle: string;
    pageDescription: string;
    status?: string;
    exhibition: Exhibition;
    builderSchema: BuilderItem[];
}

export default function SubDomainVisitorRegisterForm({
                                                         pageTitle,
                                                         pageDescription,
                                                         status,
                                                         exhibition,
                                                         builderSchema,
                                                     }: RegisterProps) {

    // this stores all select component values
    const [selectValues, setSelectValues] = useState<Record<string, string>>({});

    const handleSelectChange = (name: string, value: string) => {
        setSelectValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SdAuthLayout title={pageTitle} description={pageDescription}>
            <Form
                {...subDomain.doRegister.form({
                    exhibitionSlug : exhibition.subdomain
                })}
                className="flex flex-col gap-2 items-center justify-center"
            >
                {(formState) => (
                    <div className="space-y-3 w-full text-center">
                        <h1 className="text-4xl font-medium">{exhibition.name}</h1>
                        {builderSchema.map((item) => {
                            switch (item.type) {
                                case "text": {
                                    const t = item as TextComponent;

                                    const align =
                                        t.align === "center"
                                            ? "text-center"
                                            : t.align === "right"
                                                ? "text-right"
                                                : "text-left";

                                    const cls = `font-bold ${align}`;

                                    if (t.level === "h1")
                                        return (
                                            <h1 key={t.id} className={`text-2xl ${cls}`}>
                                                {t.content}
                                            </h1>
                                        );

                                    if (t.level === "h2")
                                        return (
                                            <h2 key={t.id} className={`text-xl ${cls}`}>
                                                {t.content}
                                            </h2>
                                        );

                                    if (t.level === "h3")
                                        return (
                                            <h3 key={t.id} className={`text-lg font-semibold ${align}`}>
                                                {t.content}
                                            </h3>
                                        );

                                    return (
                                        <h4 key={t.id} className={`text-base font-medium ${align}`}>
                                            {t.content}
                                        </h4>
                                    );
                                }
                                case "input": {
                                    const inp = item as InputComponent;

                                    return (
                                        <div className={'flex flex-col items-start justify-start gap-2'} key={inp.id} >
                                            <Label className={'flex items-center justify-center'}>
                                                {inp.label} <span className={'text-red-500'}>{inp.required && "*"}</span>
                                            </Label>

                                            <Input
                                                name={inp.id}
                                                placeholder={inp.placeholder ?? ""}
                                                required={inp.required}
                                            />

                                            <InputError message={formState.errors[inp.id]} />
                                        </div>
                                    );
                                }
                                case "select": {
                                    const sel = item as SelectComponent;
                                    const selectedValue = selectValues[sel.id] ?? "";

                                    return (
                                        <div className={'flex flex-col items-start justify-start gap-2'} key={sel.id} >
                                            <Label className={'flex items-center justify-center'}>
                                                {sel.label} <span className={'text-red-500'}>{sel.required && "*"}</span>
                                            </Label>

                                            <Select
                                                defaultValue={selectedValue}
                                                onValueChange={(value: string) =>
                                                    handleSelectChange(sel.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {sel.options.map((opt) => (
                                                        <SelectItem key={opt.id} value={opt.value}>
                                                            {opt.value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Hidden input so Inertia submits the data */}
                                            <input
                                                type="hidden"
                                                name={sel.id}
                                                value={selectedValue}
                                            />

                                            <InputError message={formState.errors[sel.id]} />
                                        </div>
                                    );
                                }
                                case "inputGroup": {
                                    const grp = item as InputGroupComponent;
                                    return (
                                        <div key={grp.id}>
                                            <Label  className={'flex items-center justify-center'}>{grp.label}</Label>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {grp.inputs.map((inp) => (
                                                    <div className={'flex flex-col items-start justify-start gap-2'} key={inp.id} >
                                                        <Label  className={'flex items-center justify-center'}>
                                                            {inp.label} <span className={'text-red-500'}>{inp.required && "*"}</span>
                                                        </Label>

                                                        <Input
                                                            name={inp.id}
                                                            placeholder={inp.placeholder ?? ""}
                                                            required={inp.required}
                                                        />

                                                        <InputError
                                                            message={formState.errors[inp.id]}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                default:
                                    return null;
                            }
                        })}
                        <div className={'flex flex-col items-center justify-center'}>
                            <Button type="submit" disabled={formState.processing} className={'cursor-pointer w-1/5'}>
                                {formState.processing ? "Submitting..." : "Submit"}
                            </Button>
                            {status && (
                                <p className="text-sm text-green-600 text-center">{status}</p>
                            )}
                            <Separator className="my-10 " />
                            <div>
                                Already registered ? <Link className={'text-blue-500 cursor-pointer'} href={subDomain.loginPage({
                                exhibitionSlug : exhibition.subdomain
                            })}>click here </Link>to login.
                            </div>
                        </div>
                    </div>
                )}
            </Form>
        </SdAuthLayout>
    );
}
