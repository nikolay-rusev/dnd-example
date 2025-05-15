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
    shrinkContainerStyle,
    TIMEOUT
} from "./utils/constants";
import { calcItemStyle, getActualElementHeight, scrollAfterDragEnd } from "./utils/helpers";

//
const allowBottomCompensation = true;

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
        const shrinkContainerHeight = shrinkContainer?.getBoundingClientRect().height;

        // Calculate remaining space
        const leftoverHeight = initialHeight - shrinkContainerHeight;

        const shrinkElement = shrinkContainer?.firstElementChild;
        const shrinkElementHeight = getActualElementHeight(shrinkElement);

        const actualContainer = document.getElementById("actual-container");
        const el = actualContainer?.firstElementChild;
        const actualElementHeight = getActualElementHeight(el);

        const activatorEvent = event.activatorEvent;
        const mouseY = activatorEvent.clientY;
        // get element for drag-handle case
        const dragHandle = activatorEvent?.srcElement;
        const draggedElement = dragHandle?.parentElement;
        const currentIndex = parseInt(draggedElement?.getAttribute("data-index"));
        const currentShrinkElement = document.querySelector(
            `#shrink-container [data-index="${currentIndex}"]`
        );

        const realHeight = Math.abs(
            draggedElement.getBoundingClientRect().top -
                draggedElement?.parentElement.getBoundingClientRect().top
        );

        const shrinkHeight = Math.abs(
            currentShrinkElement.getBoundingClientRect().top -
                currentShrinkElement?.parentElement.getBoundingClientRect().top
        );

        const mouseYInRectangle = mouseY - realHeight;
        const ratio = mouseYInRectangle / actualElementHeight;
        const topCompensation = mouseY - shrinkHeight - ratio * shrinkElementHeight;

        // easy
        const bottomCompensation = leftoverHeight - topCompensation;

        setTopFillHeight(topCompensation);
        setBottomFillHeight(bottomCompensation);
    };

    const handleDragStart = (event) => {
        if (!containerRef.current) return;

        calculateFillHeights({ event });

        setActiveId(event.active.id);
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
                <div
                    id="actual-container"
                    className="actual-container"
                    style={{ position: "relative" }}
                >
                    <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        collisionDetection={pointerWithin}
                        autoScroll={{ layoutShiftCompensation: true }}
                        measuring={{
                            droppable: {
                                strategy: MeasuringStrategy.Always // Correct way to define measuring strategy
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
            {allowBottomCompensation && (
                <div className="bottom-fill" style={{ height: bottomFillHeight }}></div>
            )}
        </div>
    );
}
