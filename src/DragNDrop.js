import React, { useState } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

function SortableItem({ id, activeId }) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                width: activeId ? 100 : 150, // Shrinks when dragging starts
                height: activeId ? 30 : 50,
                marginBottom: 8,
                background: "lightblue",
                opacity: activeId ? 0.5 : 1, // Fades out slightly
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
                transition: "all 0.2s ease"
            }}
        >
            {id}
        </div>
    );
}

export default function DragNDrop() {
    const [items, setItems] = useState([
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
        "Item 5",
        "Item 6",
        "Item 7",
        "Item 8"
    ]);
    const [activeId, setActiveId] = useState(null);

    return (
        <DndContext
            collisionDetection={pointerWithin}
            onDragStart={(event) => setActiveId(event.active.id)}
            onDragEnd={(event) => {
                setActiveId(null);
                if (event.over) {
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
