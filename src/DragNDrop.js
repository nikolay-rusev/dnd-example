import React, { useState, useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import {
    TIMEOUT,
    dragItemsArray,
    dragHandleStyle,
    defaultItemStyle,
    dummyItemStyle,
    dummyContainerStyle,
    TIMEOUT_SCROLL,
    REGULAR_WIDTH,
    SHRUNK_WIDTH,
    SHRUNK_HEIGHT,
    REGULAR_HEIGHT
} from "./utils/constants";

//
const allowBottomCompensation = true;

function calcItemStyle({ activeId, transform, last }) {
    return {
        ...defaultItemStyle,
        width: activeId ? SHRUNK_WIDTH : REGULAR_WIDTH,
        height: activeId ? SHRUNK_HEIGHT : REGULAR_HEIGHT,
        opacity: activeId ? 0.5 : 1,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        marginBottom: last ? 0 : 8
    };
}

function SortableItem({ id, activeId, dummy, last }) {
    const { attributes, setNodeRef, transform, listeners } = useSortable({ id });

    const itemStyle = dummy ? dummyItemStyle : calcItemStyle({ activeId, transform, last });

    const dragItemId = dummy ? null : `drag-item-${id}`;

    return (
        <div ref={setNodeRef} {...attributes} style={itemStyle} data-id={dragItemId}>
            <div {...listeners} className={"drag-handle"} style={dragHandleStyle}>
                ...
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

    const scrollAfterDragEnd = (event) => {
        // Scroll to the final position
        setTimeout(() => {
            document.querySelector(`[data-id=drag-item-${event.active.id}]`)?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, TIMEOUT_SCROLL); // Slight delay to allow transition
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
            // Adjust mouse Y based on scrolling
            const scrollOffset = window.scrollY;
            // const mouseY = event.active?.rect.current.translated.top + scrollOffset || 0;
            // without scroll compensation
            const mouseY = event.activatorEvent.clientY || 0;

            const dummyContainer = document.getElementById("dummy-container");
            const contextHeight = dummyContainer?.getBoundingClientRect().height || 0;

            const firstElement = dummyContainer.firstElementChild;

            const style = window.getComputedStyle(firstElement);
            const marginTop = parseFloat(style.marginTop);
            const marginBottom = parseFloat(style.marginBottom);

            const singleElementHeight =
                firstElement.getBoundingClientRect().height + marginTop + marginBottom;

            const countElements = Math.trunc(mouseY / singleElementHeight);
            const topCompensation = countElements * singleElementHeight;

            // Calculate remaining space
            const leftoverHeight = initialHeight - contextHeight;

            const bottomCompensation = leftoverHeight - topCompensation;

            setTopFillHeight(topCompensation);
            setBottomFillHeight(bottomCompensation);
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

        const { active, over } = event;

        if (over) {
            setItems((prev) => arrayMove(prev, prev.indexOf(active.id), prev.indexOf(over.id)));

            scrollAfterDragEnd(event);
        }
    };

    const getDraggableItems = ({ activeId, items, dummy = false }) => {
        return (
            <>
                <SortableContext items={items}>
                    {items.map((id, index) => (
                        <SortableItem
                            key={id}
                            id={id}
                            activeId={activeId}
                            dummy={dummy}
                            last={index === items.length - 1}
                        />
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
            {allowBottomCompensation && (
                <div className="bottom-fill" style={{ height: bottomFillHeight }}></div>
            )}
        </div>
    );
}
