import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
} from "@hello-pangea/dnd";

import type {
    BuilderItem,
    TextComponent,
    InputComponent,
    InputGroupComponent,
    SelectComponent,
} from "@/types";

import { uuid } from "@/lib/uuid";

export function BuilderDrawerEditor({
                                        item,
                                        update,
                                    }: {
    item: BuilderItem;
    update: (updated: BuilderItem) => void;
}) {

    // ---------------------------------------
    // UTIL — force rerender by cloning objects
    // ---------------------------------------
    const forceClone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

    // ---------------------------------------
    // TEXT COMPONENT
    // ---------------------------------------
    if (item.type === "text") {
        const t = item as TextComponent;

        return (
            <div className="space-y-5 p-5">
                <h2 className="text-lg font-semibold">Text Block</h2>
                <Separator />

                <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                        className="resize-none"
                        value={t.content}
                        onChange={(e) =>
                            update({ ...t, content: e.target.value })
                        }
                    />
                </div>

                <Separator />

                {/* Level + Align */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Heading Level</Label>
                        <select
                            className="w-full mt-1 rounded border bg-neutral-900 p-2 text-sm"
                            value={t.level}
                            onChange={(e) =>
                                update({
                                    ...t,
                                    level: e.target.value as TextComponent["level"],
                                })
                            }
                        >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                        </select>
                    </div>

                    <div>
                        <Label>Alignment</Label>
                        <select
                            className="w-full mt-1 rounded border bg-neutral-900 p-2 text-sm"
                            value={t.align}
                            onChange={(e) =>
                                update({
                                    ...t,
                                    align: e.target.value as TextComponent["align"],
                                })
                            }
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------
    // INPUT FIELD
    // ---------------------------------------
    if (item.type === "input") {
        const inp = item as InputComponent;

        return (
            <div className="space-y-5 p-5">
                <h2 className="text-lg font-semibold">Input Field</h2>
                <Separator />

                <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                        value={inp.label}
                        onChange={(e) =>
                            update({ ...inp, label: e.target.value })
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                        value={inp.placeholder ?? ""}
                        onChange={(e) =>
                            update({
                                ...inp,
                                placeholder: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="flex gap-2 items-center mt-3">
                    <input
                        type="checkbox"
                        checked={!!inp.required}
                        onChange={(e) =>
                            update({
                                ...inp,
                                required: e.target.checked,
                            })
                        }

                    />
                    <Label>Required</Label>
                </div>
            </div>
        );
    }

    // ---------------------------------------
    // INPUT GROUP
    // ---------------------------------------
    if (item.type === "inputGroup") {
        const grp = item as InputGroupComponent;

        const addField = () => {
            const next: InputComponent[] = [
                ...grp.inputs,
                {
                    id: uuid(),
                    type: "input",
                    label: `Field ${grp.inputs.length + 1}`,
                    placeholder: "",
                    required: false,
                },
            ];

            update(forceClone({ ...grp, inputs: next }));
        };

        const onDragEnd = (result: DropResult) => {
            if (!result.destination) return;

            const reordered = [...grp.inputs];
            const [moved] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, moved);

            update(forceClone({ ...grp, inputs: reordered }));
        };

        const updateField = (
            id: string,
            key: keyof Pick<InputComponent, "label" | "placeholder" | "required">,
            value: string | boolean
        ) => {
            const next = grp.inputs.map((f) =>
                f.id === id ? { ...f, [key]: value } : f
            );
            update(forceClone({ ...grp, inputs: next }));
        };

        const removeField = (id: string) => {
            const next = grp.inputs.filter((f) => f.id !== id);
            update(forceClone({ ...grp, inputs: next }));
        };

        return (
            <div className="space-y-6 p-5">
                <h2 className="text-lg font-semibold">Input Group</h2>
                <Separator />

                <div className="space-y-2">
                    <Label>Group Label</Label>
                    <Input
                        value={grp.label}
                        onChange={(e) =>
                            update({ ...grp, label: e.target.value })
                        }
                    />
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div className="font-medium text-sm">
                        Fields ({grp.inputs.length})
                    </div>
                    <Button size="sm" variant="outline" onClick={addField}>
                        + Add Field
                    </Button>
                </div>

                {/* LIST */}
                <div className="h-[calc(55vh-2.5rem)] overflow-y-auto pr-2">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="group-fields">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="space-y-3"
                                >
                                    {grp.inputs.map((f, index) => (
                                        <Draggable
                                            key={f.id}
                                            draggableId={f.id}
                                            index={index}
                                        >
                                            {(p, snapshot) => (
                                                <div
                                                    ref={p.innerRef}
                                                    {...p.draggableProps}
                                                    style={{
                                                        ...p.draggableProps.style,
                                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                                    }}
                                                    className="rounded-md border border-neutral-800 p-3 bg-neutral-900"
                                                >
                                                    {/* HEADER */}
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div
                                                            {...p.dragHandleProps}
                                                            className="cursor-grab text-neutral-500"
                                                        >
                                                            ⋮⋮
                                                        </div>

                                                        <div className="text-sm font-medium flex-1">
                                                            Field {index + 1}
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-7 px-2"
                                                            onClick={() => removeField(f.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>

                                                    {/* LABEL */}
                                                    <Label className="text-xs text-neutral-400">
                                                        Label:
                                                    </Label>
                                                    <Input
                                                        className="mt-1 mb-3"
                                                        value={f.label}
                                                        onChange={(e) =>
                                                            updateField(
                                                                f.id,
                                                                "label",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    {/* PLACEHOLDER */}
                                                    <Label className="text-xs text-neutral-400">
                                                        Placeholder:
                                                    </Label>
                                                    <Input
                                                        className="mt-1 mb-3"
                                                        value={f.placeholder ?? ""}
                                                        onChange={(e) =>
                                                            updateField(
                                                                f.id,
                                                                "placeholder",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    {/* REQUIRED */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!f.required}
                                                            onChange={(e) =>
                                                                updateField(
                                                                    f.id,
                                                                    "required",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <Label>Required</Label>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        );
    }

    // ---------------------------------------
    // SELECT FIELD (FINAL FIXED)
    // ---------------------------------------
    if (item.type === "select") {
        const sel = item as SelectComponent;

        // FIX: sanitize ONCE in useEffect, not during render
        // --- SANITIZE SELECT OPTIONS (runs only for select items) ---
        React.useEffect(() => {
            if (item.type !== "select") return;

            const sel = item as SelectComponent;

            const fixed = sel.options.map((o) => {
                if (
                    o &&
                    typeof o.id === "string" &&
                    typeof o.value === "string"
                ) {
                    return o;
                }
                return {
                    id: uuid(),
                    value: typeof (o as any)?.value === "string" ? (o as any).value : "",
                };
            });

            // Only update if something changed
            const isDifferent =
                fixed.length !== sel.options.length ||
                fixed.some((f, i) => f.id !== sel.options[i].id);

            if (isDifferent) {
                update({ ...sel, options: fixed });
            }
// eslint-disable-next-line react-hooks/exhaustive-deps
        }, [item]);


        const addOption = () => {
            update({
                ...sel,
                options: [...sel.options, { id: uuid(), value: "" }],
            });
        };

        const updateOption = (id: string, value: string) => {
            update({
                ...sel,
                options: sel.options.map((o) =>
                    o.id === id ? { ...o, value } : o
                ),
            });
        };

        const removeOption = (id: string) => {
            update({
                ...sel,
                options: sel.options.filter((o) => o.id !== id),
            });
        };

        const onDragEnd = (result: DropResult) => {
            if (!result.destination) return;

            const reordered = [...sel.options];
            const [moved] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, moved);

            update({ ...sel, options: reordered });
        };

        return (
            <div className="space-y-6 p-5">
                <h2 className="text-lg font-semibold">Select Field</h2>
                <Separator />

                <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                        value={sel.label}
                        onChange={(e) =>
                            update({ ...sel, label: e.target.value })
                        }
                    />
                </div>

                <div className="flex items-center justify-between pt-3">
                    <div className="font-medium text-sm">
                        Options ({sel.options.length})
                    </div>
                    <Button variant="outline" size="sm" onClick={addOption}>
                        + Add Option
                    </Button>
                </div>

                <div className="h-[calc(50vh-4.3rem)] overflow-y-auto pr-2">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="select-options">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="space-y-2"
                                >
                                    {sel.options.map((opt, index) => (
                                        <Draggable
                                            key={opt.id}
                                            draggableId={opt.id}
                                            index={index}
                                        >
                                            {(p, snapshot) => (
                                                <div
                                                    ref={p.innerRef}
                                                    {...p.draggableProps}
                                                    className="rounded-md border border-neutral-800 bg-neutral-900 p-3"
                                                    style={{
                                                        ...p.draggableProps.style,
                                                        opacity: snapshot.isDragging ? 0.85 : 1,
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div
                                                            {...p.dragHandleProps}
                                                            className="cursor-grab text-neutral-500"
                                                        >
                                                            ⋮⋮
                                                        </div>

                                                        <div className="font-medium text-sm flex-1">
                                                            Option {index + 1}
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-7 px-2"
                                                            onClick={() =>
                                                                removeOption(opt.id)
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>

                                                    <Label className="text-xs text-neutral-400">
                                                        Value:
                                                    </Label>
                                                    <Input
                                                        className="mt-1"
                                                        value={opt.value}
                                                        onChange={(e) =>
                                                            updateOption(
                                                                opt.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        checked={!!sel.required}
                        onChange={(e) =>
                            update({
                                ...sel,
                                required: e.target.checked,
                            })
                        }
                    />
                    <Label>Required</Label>
                </div>
            </div>
        );
    }


    return null;
}
