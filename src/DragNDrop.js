import React, { useState, useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { TIMEOUT, dragItemsArray, dragHandleStyle, defaultItemStyle } from "./utils/constants";

function calcItemStyle({ activeId, transform }) {
    return {
        ...defaultItemStyle,
        width: activeId ? 100 : 150,
        height: activeId ? 30 : 50,
        opacity: activeId ? 0.5 : 1,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`
    };
}

function SortableItem({ id, activeId }) {
    const { attributes, setNodeRef, transform, listeners } = useSortable({ id });

    const itemStyle = calcItemStyle({ activeId, transform });

    return (
        <div ref={setNodeRef} {...attributes} style={itemStyle}>
            <div {...listeners} className={"drag-handle"} style={dragHandleStyle}>
                ☰
            </div>
            {id}
        </div>
    );
}

export default function DragNDrop() {
    const [items, setItems] = useState(dragItemsArray);
    const [activeId, setActiveId] = useState(null);
    const containerRef = useRef(null);
    const [topFillHeight, setTopFillHeight] = useState(0);
    const [bottomFillHeight, setBottomFillHeight] = useState(0);

    const resetFillHeights = () => {
        setTimeout(() => {
            setTopFillHeight(0);
            setBottomFillHeight(0);
        }, TIMEOUT);
    };

    const calculateFillHeights = ({ event }) => {
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
        }, TIMEOUT); // Ensuring transition has completed
    };

    const handleDragStart = (event) => {
        if (!containerRef.current) return;

        setActiveId(event.active.id);

        calculateFillHeights({ event });
    };

    const handleDragEnd = (event) => {
        setActiveId(null);

        // Smooth reset of fill heights
        resetFillHeights();

        if (event.over) {
            setItems((prev) =>
                arrayMove(prev, prev.indexOf(event.active.id), prev.indexOf(event.over.id))
            );
        }
    };

    const getDraggableItems = ({ activeId, items }) => {
        return (
            <>
                <SortableContext items={items}>
                    {items.map((id) => (
                        <SortableItem key={id} id={id} activeId={activeId} />
                    ))}
                </SortableContext>

                <DragOverlay>
                    {activeId ? <SortableItem id={activeId} activeId={activeId} /> : null}
                </DragOverlay>
            </>
        );
    };

    return (
        <div className="dnd-container" ref={containerRef} style={{ position: "relative" }}>
            <div
                className="top-fill"
                style={{ height: topFillHeight, transition: "height 0.2s ease" }}
            ></div>
            <div className="dnd-context-container" id="dnd-context-container">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {getDraggableItems({ activeId, items })}
                </DndContext>
            </div>
            <div
                className="bottom-fill"
                style={{ height: bottomFillHeight, transition: "height 0.2s ease" }}
            ></div>
        </div>
    );
}
