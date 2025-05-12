import React, { useState, useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { snapHandleToCursor } from "./utils/snapHandleToCursor";
import {
    TIMEOUT,
    dragItemsArray,
    dragHandleStyle,
    defaultItemStyle,
    dummyItemStyle,
    dummyContainerStyle
} from "./utils/constants";

function calcItemStyle({ activeId, transform }) {
    return {
        ...defaultItemStyle,
        width: activeId ? 100 : 150,
        height: activeId ? 30 : 50,
        opacity: activeId ? 0.5 : 1,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`
    };
}

function SortableItem({ id, activeId, dummy }) {
    const { attributes, setNodeRef, transform, listeners } = useSortable({ id });

    const itemStyle = dummy ? dummyItemStyle : calcItemStyle({ activeId, transform });

    const dragItemId = dummy ? null : `drag-item-${id}`;

    return (
        <div ref={setNodeRef} {...attributes} style={itemStyle} data-id={dragItemId}>
            <div {...listeners} className={"drag-handle"} style={dragHandleStyle}>
                ☰
            </div>
            Item {id}
        </div>
    );
}

export default function DragNDrop() {
    const [items, setItems] = useState(dragItemsArray);
    const [activeId, setActiveId] = useState(null);
    const containerRef = useRef(null);
    const [topFillHeight, setTopFillHeight] = useState(0);
    const [bottomFillHeight, setBottomFillHeight] = useState(0);

    const scrollActiveElementIntoView = (id) => {
        document.querySelector(`[data-id=drag-item-${id}]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };

    const scrollAfterDragEnd = (event) => {
        // Scroll to the final position
        setTimeout(() => {
            document.querySelector(`[data-id=drag-item-${event.active.id}]`)?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 200); // Slight delay to allow transition
    };

    const resetFillHeights = () => {
        setTimeout(() => {
            setTopFillHeight(0);
            setBottomFillHeight(0);
        }, TIMEOUT);
    };

    const calculateFillHeights = ({ event }) => {
        // Capture the original container height
        const initialHeight = containerRef.current.getBoundingClientRect().height;

        // Get the context container height after shrinking (assuming transitions complete)
        setTimeout(() => {
            const contextHeight =
                document.getElementById("dummy-container")?.getBoundingClientRect().height || 0;

            // Calculate remaining space
            const leftoverHeight = initialHeight - contextHeight;

            // Adjust mouse Y based on scrolling
            const scrollOffset = window.scrollY;

            const mouseY = event.active?.rect.current.translated.top + scrollOffset || 0;

            const proportion = mouseY / initialHeight;

            setTopFillHeight(leftoverHeight * proportion);
            setBottomFillHeight(leftoverHeight * (1 - proportion));

            // scrollActiveElementIntoView(event.active.id);
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

            scrollAfterDragEnd(event);
        }
    };

    const getDraggableItems = ({ activeId, items, dummy = false }) => {
        return (
            <>
                <SortableContext items={items}>
                    {items.map((id) => (
                        <SortableItem key={id} id={id} activeId={activeId} dummy={dummy} />
                    ))}
                </SortableContext>
                <DragOverlay modifiers={[]}>
                    {activeId ? <SortableItem id={activeId} activeId={activeId} /> : null}
                </DragOverlay>
            </>
        );
    };

    const children = getDraggableItems({ activeId, items });
    const dummyChildren = getDraggableItems({ activeId, items, dummy: true });

    return (
        <div className="dnd-container" ref={containerRef} style={{ position: "relative" }}>
            <div className="top-fill" style={{ height: topFillHeight }}></div>
            <div id="dnd-context-container" className="dnd-context-container">
                <div className="actual-container" style={{ position: "relative" }}>
                    <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        autoScroll={{ layoutShiftCompensation: false }}
                    >
                        {children}
                    </DndContext>
                </div>
                <div id="dummy-container" style={dummyContainerStyle}>
                    {dummyChildren}
                </div>
            </div>
            <div className="bottom-fill" style={{ height: bottomFillHeight }}></div>
        </div>
    );
}
