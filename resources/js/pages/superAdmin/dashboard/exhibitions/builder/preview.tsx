import React from "react";
import type {
    BuilderItem,
    TextComponent,
    InputComponent,
    SelectComponent,
    InputGroupComponent,
} from "@/types";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function BuilderPreview({ items }: { items: BuilderItem[] }) {
    return (
        <div className="md:absolute inset-0 p-2 md:p-4 z-20">
            <div className="rounded-md border border-neutral-800 shadow-md">
                <div className="rounded-md p-4 bg-[#000]">
                    <div className="space-y-4">

                        {items.map((it) => {
                            switch (it.type) {

                                // ---------------- TEXT ----------------
                                case "text": {
                                    const t = it as TextComponent;
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

                                // ---------------- INPUT ----------------
                                case "input": {
                                    const inp = it as InputComponent;

                                    return (
                                        <div key={inp.id}>
                                            <Label className="block text-sm font-medium mb-1">
                                                {inp.label}{" "}
                                                {inp.required && (
                                                    <span className="text-red-500">*</span>
                                                )}
                                            </Label>

                                            <Input
                                                className="w-full rounded border border-neutral-800 bg-transparent p-2"
                                                placeholder={inp.placeholder}
                                                required={inp.required}
                                                disabled
                                            />
                                        </div>
                                    );
                                }

                                // ---------------- SELECT ----------------
                                case "select": {
                                    const sel = it as SelectComponent;

                                    return (
                                        <div key={sel.id}>
                                            <Label className="block text-sm font-medium mb-1">
                                                {sel.label}{" "}
                                                {sel.required && (
                                                    <span className="text-red-500">*</span>
                                                )}
                                            </Label>

                                            <select className="w-full rounded border border-neutral-800 bg-transparent p-2" disabled>
                                                {sel.options.map((o) => (
                                                    <option key={o.id}>{o.value}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                }

                                // ---------------- INPUT GROUP ----------------
                                case "inputGroup": {
                                    const grp = it as InputGroupComponent;

                                    return (
                                        <div key={grp.id}>
                                            <Label className="block text-sm font-medium mb-1">
                                                {grp.label}
                                            </Label>

                                            <div className="grid grid-cols-2 gap-2">
                                                {grp.inputs.map((inp) => (
                                                    <div key={inp.id}>
                                                        <Label className="block text-xs font-medium mb-1">
                                                            {inp.label}{" "}
                                                            {inp.required && (
                                                                <span className="text-red-500">*</span>
                                                            )}
                                                        </Label>

                                                        <Input
                                                            className="w-full rounded border border-neutral-800 bg-transparent p-2"
                                                            placeholder={inp.placeholder}
                                                            required={inp.required}
                                                            disabled
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
                    </div>
                </div>
            </div>
        </div>
    );
}
