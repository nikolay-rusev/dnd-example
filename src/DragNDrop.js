import React, { useState, useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
// import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import {
    TIMEOUT,
    dragItemsArray,
    dragHandleStyle,
    defaultItemStyle,
    dummyItemStyle,
    shrinkContainerStyle,
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
        <div
            ref={setNodeRef}
            {...attributes}
            style={itemStyle}
            data-id={dragItemId}
            data-index={id}
        >
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

        // shrunk container height
        const shrinkContainer = document.getElementById("shrink-container");
        const shrinkContainerHeight = shrinkContainer?.getBoundingClientRect().height || 0;

        // Calculate remaining space
        const leftoverHeight = initialHeight - shrinkContainerHeight;

        const el = shrinkContainer.firstElementChild;
        const style = window.getComputedStyle(el);
        const marginTop = parseFloat(style.marginTop);
        const marginBottom = parseFloat(style.marginBottom);
        // calculate single element height
        const singleElementHeight = el.getBoundingClientRect().height + marginTop + marginBottom;

        // Get the context container height after shrinking (assuming transitions complete)
        setTimeout(() => {
            // Adjust mouse Y based on scrolling
            // const scrollOffset = window.scrollY;

            const activatorEvent = event.activatorEvent;
            const mouseY = activatorEvent.clientY || 0;
            // in case of drag handle use srcElement?.parentElement
            const currentElement = activatorEvent?.srcElement?.parentElement;
            const currentIndex = parseInt(currentElement?.getAttribute("data-index"));
            const currentPosition = items.indexOf(currentIndex);

            // how many elements fit the height of cursor
            const elCount = Math.trunc(mouseY / singleElementHeight);

            // todo: make it work
            const topCompensation = (elCount - 1) * singleElementHeight + singleElementHeight / 2;

            // easy
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
                <div id="shrink-container" style={shrinkContainerStyle}>
                    {dummyChildren}
                </div>
            </div>
            {allowBottomCompensation && (
                <div className="bottom-fill" style={{ height: bottomFillHeight }}></div>
            )}
        </div>
    );
}
