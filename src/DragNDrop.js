import React, { useRef, useState } from "react";
import {DndContext, DragOverlay, pointerWithin} from "@dnd-kit/core";
import {
    restrictToParentElement,
    restrictToVerticalAxis,
    snapCenterToCursor
} from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import {
    defaultItemStyle,
    dragHandleStyle,
    dragItemsArray,
    dummyItemStyle,
    REGULAR_HEIGHT,
    REGULAR_WIDTH,
    shrinkContainerStyle,
    SHRUNK_HEIGHT,
    SHRUNK_WIDTH,
    TIMEOUT,
    TIMEOUT_SCROLL
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

function SortableItem({ id, activeId, dummy, last, className }) {
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
            className={className}
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

    function getActualElementHeight(el) {
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const marginTop = parseFloat(style.marginTop);
        const marginBottom = parseFloat(style.marginBottom);
        return el.getBoundingClientRect().height + marginTop + marginBottom;
    }

    const calculateFillHeights = ({ event }) => {
        // Capture the original container height
        const initialHeight = containerRef.current.getBoundingClientRect().height;

        // shrunk container height
        const shrinkContainer = document.getElementById("shrink-container");
        const shrinkContainerHeight = shrinkContainer?.getBoundingClientRect().height;

        // Calculate remaining space
        const leftoverHeight = initialHeight - shrinkContainerHeight;

        const shrinkElement = shrinkContainer?.firstElementChild;
        const shrinkElementHeight = getActualElementHeight(shrinkElement);

        const actualContainer = document.getElementById("actual-container");
        const el = actualContainer?.firstElementChild;
        const actualElementHeight = getActualElementHeight(el);

        // Get the context container height after shrinking (assuming transitions complete)
        setTimeout(() => {
            const activatorEvent = event.activatorEvent;
            const mouseY = activatorEvent.clientY || 0;
            // get element for drag-handle case
            const dragHandle = activatorEvent?.srcElement;
            const draggedElement = dragHandle?.parentElement;
            const topOfDraggedElement = draggedElement.getBoundingClientRect().top;
            const currentIndex = parseInt(draggedElement?.getAttribute("data-index"));

            const currentShrinkElement = document.querySelector(
                `#shrink-container [data-index="${currentIndex}"]`
            );
            const topOfShrinkEl = currentShrinkElement.getBoundingClientRect().top;

            // height between top corner of dragged element and mouse point y
            const adjust = mouseY - topOfDraggedElement;
            const topCompensation =
                topOfDraggedElement - topOfShrinkEl + adjust - shrinkElementHeight / 2;

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

            // scrollAfterDragEnd(event);
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
                <DragOverlay
                    modifiers={[
                        snapCenterToCursor,
                        restrictToVerticalAxis,
                        restrictToParentElement
                    ]}
                >
                    {activeId ? (
                        <SortableItem
                            id={activeId}
                            activeId={activeId}
                            className={"drag-overlay"}
                        />
                    ) : null}
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
                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
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
