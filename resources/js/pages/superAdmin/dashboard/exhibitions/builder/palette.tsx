// resources/js/pages/superAdmin/dashboard/exhibitions/builder/palette.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { IconTextSize, IconBox, IconList, IconSelector } from "@tabler/icons-react";
import type { BuilderItem } from "@/types";
import { uuid } from "@/lib/uuid";

export function BuilderPalette({ onAdd }: { onAdd: (item: BuilderItem) => void }) {
    const makeText = (): BuilderItem => ({
        id: uuid(),
        type: "text",
        level: "h2",
        align: "left",
        content: "Heading text",
    });

    const makeInput = (): BuilderItem => ({
        id: uuid(),
        type: "input",
        label: "Input",
        placeholder: "",
        required: false,
    });

    const makeInputGroup = (): BuilderItem => ({
        id: uuid(),
        type: "inputGroup",
        label: "Input Group",
        inputs: [],
    });

    const makeSelect = (): BuilderItem => ({
        id: uuid(),
        type: "select",
        label: "Select",
        options: ["Option 1", "Option 2"],
        required: false,
    });

    return (
        <div className="space-y-4">
            <div className="text-xs font-semibold uppercase text-muted-foreground px-2">Display Elements</div>
            <div className="space-y-2 px-2">
                <Button type={'button'} variant="ghost" className="w-full justify-start gap-3" onClick={() => onAdd(makeText())}>
                    <IconTextSize /> Text
                </Button>
                <Button type={'button'} variant="ghost" className="w-full justify-start gap-3" onClick={() => onAdd(makeInput())}>
                    <IconBox /> Input
                </Button>
            </div>

            <div className="text-xs font-semibold uppercase text-muted-foreground px-2 pt-4">Field Elements</div>
            <div className="space-y-2 px-2">
                <Button type={'button'} variant="ghost" className="w-full justify-start gap-3" onClick={() => onAdd(makeInputGroup())}>
                    <IconList /> Input Group
                </Button>
                <Button type={'button'} variant="ghost" className="w-full justify-start gap-3" onClick={() => onAdd(makeSelect())}>
                    <IconSelector /> Select
                </Button>
            </div>
        </div>
    );
}
