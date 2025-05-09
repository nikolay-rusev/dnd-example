import React, { useState, useRef } from "react";
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
    const containerRef = useRef(null);
    const [topFillHeight, setTopFillHeight] = useState(0);
    const [bottomFillHeight, setBottomFillHeight] = useState(0);

    const handleDragStart = (event) => {
        if (!containerRef.current) return;

        // Capture the original container height
        const initialHeight = containerRef.current.offsetHeight;

        // Get the context container height after shrinking (assuming transitions complete)
        setTimeout(() => {
            const contextHeight =
                document.getElementById("dnd-context-container")?.offsetHeight || 0;

            // Calculate remaining space
            const leftoverHeight = initialHeight - contextHeight;

            // Distribute space based on mouse Y position
            const mouseY = event.active?.rect.current.translated.top || 0;
            const proportion = mouseY / initialHeight;

            setTopFillHeight(leftoverHeight * proportion);
            setBottomFillHeight(leftoverHeight * (1 - proportion));
        }, 200); // Ensuring transition has completed

        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        setTopFillHeight(0);
        setBottomFillHeight(0);

        if (event.over) {
            setItems((prev) =>
                arrayMove(prev, prev.indexOf(event.active.id), prev.indexOf(event.over.id))
            );
        }
    };

    return (
        <div className="dnd-container" ref={containerRef} style={{ height: "auto" }}>
            <div className="top-fill" style={{ height: topFillHeight }}></div>
            <div className="dnd-context-container" id={"dnd-context-container"}>
                <DndContext
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
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
            </div>
            <div className="bottom-fill" style={{ height: bottomFillHeight }}></div>
        </div>
    );
}
