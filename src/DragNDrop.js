import React, { useRef, useState } from "react";
import { DndContext, DragOverlay, MeasuringStrategy, pointerWithin } from "@dnd-kit/core";
import {
    restrictToParentElement,
    restrictToVerticalAxis,
    snapCenterToCursor
} from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import {
    dragHandleStyle,
    dragItemsArray,
    dummyItemStyle,
    OUTER_CONTENT_HEIGHT,
    shrinkContainerStyle,
    TIMEOUT,
    TRANSITION
} from "./utils/constants";
import { calcItemStyle, scrollAfterDragEnd } from "./utils/helpers";
import { calculateFillHeights } from "./utils/calc";

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

    const handleDragStart = (event) => {
        if (!containerRef.current) return;

        // scroll offset on y
        const scrollOffset = window.scrollY;
        console.log("scrollOffset", scrollOffset);
        const { top, bottom } = calculateFillHeights({ event, containerRef });

        setTopFillHeight(top);
        setBottomFillHeight(bottom);
        // restore scroll position
        console.log("before adjust scrollOffset", scrollOffset);
        console.log("----------------------------------------------------------------------");
        window.scrollTo({ top: scrollOffset });

        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);

        // reset of fill heights
        setTimeout(() => {
            setTopFillHeight(0);
            setBottomFillHeight(0);
        }, TIMEOUT);

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
                <DragOverlay modifiers={[snapCenterToCursor, restrictToVerticalAxis]}>
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
        <>
            <div
                style={{ height: OUTER_CONTENT_HEIGHT, backgroundColor: "mediumaquamarine" }}
            ></div>
            <div className="dnd-container" ref={containerRef} style={{ position: "relative" }}>
                <div
                    className="top-fill"
                    style={{ transition: TRANSITION, height: topFillHeight + "px" }}
                ></div>
                <div id="dnd-context-container" className="dnd-context-container">
                    <div
                        id="actual-container"
                        className="actual-container"
                        style={{ position: "relative" }}
                    >
                        <DndContext
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            collisionDetection={pointerWithin}
                            autoScroll={{ layoutShiftCompensation: false }}
                            measuring={{
                                droppable: {
                                    strategy: MeasuringStrategy.WhileDragging
                                }
                            }}
                        >
                            {children}
                        </DndContext>
                    </div>
                    <div id="shrink-container" style={shrinkContainerStyle}>
                        {dummyChildren}
                    </div>
                </div>
                <div
                    className="bottom-fill"
                    style={{ transition: TRANSITION, height: bottomFillHeight + "px" }}
                ></div>
            </div>
            <div
                style={{ height: OUTER_CONTENT_HEIGHT, backgroundColor: "mediumaquamarine" }}
            ></div>
        </>
    );
}
