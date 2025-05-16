import React, { useRef, useState } from "react";
import { DndContext, DragOverlay, MeasuringStrategy, pointerWithin } from "@dnd-kit/core";
import { restrictToVerticalAxis, snapCenterToCursor } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
    OUTER_CONTENT_HEIGHT,
    shrinkContainerStyle,
    TIMEOUT,
    TRANSITION
} from "../utils/constants";
import { scrollAfterDragEnd } from "../utils/helpers";
import { calculateFillHeights } from "../utils/calc";
import { SortableItem } from "./SortableItem";
import "./DragNDrop.css";

const topHandle = true;
const itemsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function DragNDrop() {
    const [items, setItems] = useState(itemsArray);
    const [activeId, setActiveId] = useState(null);
    const containerRef = useRef(null);
    const [topFillHeight, setTopFillHeight] = useState(0);
    const [bottomFillHeight, setBottomFillHeight] = useState(0);

    const handleDragStart = (event) => {
        if (!containerRef.current) return;

        // scroll offset on y
        const scrollOffset = window.scrollY;
        console.log("scrollOffset", scrollOffset);
        const { top, bottom } = calculateFillHeights({ event, containerRef, topHandle });

        setTopFillHeight(top);
        setBottomFillHeight(bottom);
        // restore scroll position
        console.log("before adjust scrollOffset", scrollOffset);
        console.log("----------------------------------------------------------------------");
        window.scrollTo({ top: scrollOffset });

        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        const activeId = active.id;

        setActiveId(null);

        // reset of fill heights
        setTimeout(() => {
            setTopFillHeight(0);
            setBottomFillHeight(0);
        }, TIMEOUT);

        if (over) {
            setItems((prev) => arrayMove(prev, prev.indexOf(activeId), prev.indexOf(over.id)));

            scrollAfterDragEnd(activeId);
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
