// resources/js/pages/superAdmin/dashboard/exhibitions/builder/canvas.tsx
import React from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { BuilderItem } from "@/types";
import { CanvasItem } from "./itemRender";

export function BuilderCanvas({
                                  items,
                                  setItems,
                                  onEdit,
                                  onRemove,
                              }: {
    items: BuilderItem[];
    setItems: (items: BuilderItem[]) => void;
    onEdit: (item: BuilderItem) => void;
    onRemove: (id: string) => void;
}) {
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const updated = Array.from(items);
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        setItems(updated);
    };

    return (
        <div className="bg-transparent min-h-[320px]">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="builder-canvas">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 min-h-[300px]">
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(prov, snapshot) => (
                                        <div
                                            ref={prov.innerRef}
                                            {...prov.draggableProps}
                                            style={{ ...prov.draggableProps.style, opacity: snapshot.isDragging ? 0.9 : 1 }}
                                        >
                                            <CanvasItem
                                                item={item}
                                                dragHandleProps={prov.dragHandleProps}
                                                onEdit={() => onEdit(item)}
                                                onRemove={() => onRemove(item.id)}
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
    );
}
