// resources/js/pages/superAdmin/dashboard/exhibitions/registrationFormEditor.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BuilderPalette } from "./builder/palette";
import { BuilderCanvas } from "./builder/canvas";
import { BuilderPreview } from "./builder/preview";
import { BuilderDrawerEditor } from "./builder/drawerEditor";
import type { BuilderItem, InputComponent } from "@/types";
import { uuid } from "@/lib/uuid";
import { cn } from '@/lib/utils';

interface Props {
    initial?: BuilderItem[]; // pass builder_schema from server
}

export default function RegistrationFormEditor({ initial = [] }: Props) {
    // normalize initial (ensure ids)
    const normalized = useMemo(
        () => initial.map((it) => (it.id ? it : { ...it, id: uuid() })),
        [initial]
    );

    const [items, setItems] = useState<BuilderItem[]>(normalized);
    const [selected, setSelected] = useState<BuilderItem | null>(null);

    // ensure email exists (first item) and is enforced
    useEffect(() => {
        setItems((prev) => {
            const hasEmail = prev.some((it) => it.type === "input" && it.id === "email");
            if (hasEmail) {
                return prev.map((it) =>
                    it.id === "email" && it.type === "input"
                        ? ({ ...(it as InputComponent), label: "Email", required: true })
                        : it
                );
            }
            const emailField: InputComponent = {
                id: "email",
                type: "input",
                label: "Email",
                placeholder: "visitor@example.com",
                required: true,
            };
            return [emailField as BuilderItem, ...prev];
        });
    }, []);

    const openEditor = (item: BuilderItem) => setSelected(item);
    const closeEditor = () => setSelected(null);

    const updateItem = (updated: BuilderItem) => {
        setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setSelected(updated);
    };

    const addItem = (item: BuilderItem) => {
        if (item.id === "email") return;
        setItems((prev) => [...prev, item]);
    };

    const removeItem = (id: string) => {
        if (id === "email") return;
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    return (
        <div className="w-full">
            <Card className="rounded-md shadow-none">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] gap-4">
                        {/* LEFT: palette */}
                        <div className="col-span-1">
                            <BuilderPalette onAdd={addItem} />
                        </div>

                        {/* MIDDLE: canvas */}
                        <div className="col-span-1 min-h-[360px]">
                            <BuilderCanvas
                                items={items}
                                setItems={setItems}
                                onEdit={openEditor}
                                onRemove={removeItem}
                            />
                        </div>

                        {/* RIGHT: preview */}
                        <div className="col-span-1 relative w-full border rounded-md ">
                            <div
                                className={cn(
                                    "absolute inset-0 z-10 ",
                                    "[background-size:20px_20px]",
                                    "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                                    "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                                )}
                            />
                            <BuilderPreview items={items} />
                        </div>
                    </div>


                    {/* Hidden field for server */}
                    <input type="hidden" name="builder_schema" value={JSON.stringify(items)} />
                </CardContent>
            </Card>

            {/* RIGHT sheet editor */}
            <Sheet open={!!selected} onOpenChange={closeEditor}>
                <SheetContent side="right" className="w-[420px]">
                    <SheetHeader>
                        <SheetTitle>Edit Component</SheetTitle>
                    </SheetHeader>

                    {selected && <BuilderDrawerEditor item={selected} update={updateItem} />}
                </SheetContent>
            </Sheet>
        </div>
    );
}
