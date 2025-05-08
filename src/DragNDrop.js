import React, { useState } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

function SortableItem({ id, activeId }) {
    const { attributes, listeners, setNodeRef } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                width: activeId ? 100 : 150,
                height: activeId ? 30 : 50,
                marginBottom: 8,
                background: "lightblue",
                opacity: activeId ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px",
                transition: "all 0.2s ease"
            }}
        >
            {id}
            <div
                {...listeners}
                {...attributes}
                style={{
                    width: 20,
                    height: 20,
                    background: "gray",
                    cursor: "grab",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    marginLeft: 8
                }}
            >
                ☰
            </div>
        </div>
    );
}

export default function DragNDrop() {
    const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
    const [activeId, setActiveId] = useState(null);

    return (
        <DndContext
            collisionDetection={pointerWithin}
            onDragStart={(event) => setActiveId(event.active.id)}
            onDragEnd={(event) => {
                setActiveId(null);
                if (event.over && event.active.id !== event.over.id) {
                    setItems((prev) =>
                        arrayMove(prev, prev.indexOf(event.active.id), prev.indexOf(event.over.id))
                    );
                }
            }}
        >
            <SortableContext items={items}>
                {items.map((id) => (
                    <SortableItem key={id} id={id} activeId={activeId} />
                ))}
            </SortableContext>

            <DragOverlay modifiers={[snapCenterToCursor]}>
                {activeId ? <SortableItem id={activeId} activeId={activeId} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
