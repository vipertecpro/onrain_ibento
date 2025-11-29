// resources/js/pages/superAdmin/dashboard/exhibitions/builder/itemRender.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import type { BuilderItem, InputComponent, SelectComponent, InputGroupComponent } from "@/types";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { EditIcon, Trash2Icon } from 'lucide-react';

export function CanvasItem({
                               item,
                               dragHandleProps,
                               onEdit,
                               onRemove,
                           }: {
    item: BuilderItem;
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
    onEdit: () => void;
    onRemove: () => void;
}) {
    const handleProps = (dragHandleProps ?? {}) as React.HTMLAttributes<HTMLDivElement>;

    const summary = (() => {
        if (item.type === "input") return (item as InputComponent).label;
        if (item.type === "select") return (item as SelectComponent).label;
        if (item.type === "inputGroup") return (item as InputGroupComponent).label;
        return undefined;
    })();

    return (
        <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-white/5 border border-neutral-800">
            <div className="flex items-center gap-3">
                <div {...handleProps} className="cursor-grab text-muted-foreground">⋮⋮</div>
                <div>
                    <div className="text-sm font-semibold">{item.type.toUpperCase()}</div>
                    {summary && <div className="text-xs text-muted-foreground">{summary}</div>}
                </div>
            </div>

            <div className="flex gap-2">
                <Button type={'button'} size="sm" variant="outline" onClick={onEdit}  className={'cursor-pointer'}><EditIcon /></Button>
                <Button type={'button'} size="sm" variant="destructive" onClick={onRemove} className={'cursor-pointer'}><Trash2Icon /> </Button>
            </div>
        </div>
    );
}
