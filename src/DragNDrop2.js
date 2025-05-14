import "./styles.css";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { DndContext, DragOverlay, MeasuringStrategy, pointerWithin } from "@dnd-kit/core";
import {
    restrictToParentElement,
    restrictToVerticalAxis,
    snapCenterToCursor
} from "@dnd-kit/modifiers";
import {
    dragHandleStyle,
    dragItemsArray,
    dummyItemStyle,
    shrinkContainerStyle,
    TIMEOUT
} from "./utils/constants";
import { calcItemStyle, scrollAfterDragEnd } from "./utils/helpers";
import { useRef, useState } from "react";

function SortableItem({ id, index, shrink, dummy, last, className }) {
    const sortable = useSortable({ id, index });

    const itemStyle = dummy ? dummyItemStyle : calcItemStyle({ shrink, last });

    const dragItemId = dummy ? null : `drag-item-${id}`;

    return (
        <div
            ref={sortable?.ref}
            style={itemStyle}
            data-id={dragItemId}
            data-index={id}
            className={className}
        >
            {id}
        </div>
    );
}

export default function DragNDrop2() {
    const [items, setItems] = useState(dragItemsArray);
    const containerRef = useRef(null);
    const [topFillHeight, setTopFillHeight] = useState(0);
    const [bottomFillHeight, setBottomFillHeight] = useState(0);

    const handleBeforeDragStart = (event) => {
        if (!containerRef.current) return;

        // calculateFillHeights({ event });
    };

    const handleDragEnd = (event) => {
        // Smooth reset of fill heights
        // resetFillHeights();

        const draggedItem = event.operation.source;

        return setItems((items) => move(items, event));
    };

    const getDraggableItems = ({ items, dummy = false }) => {
        return (
            <>
                <SortableContext items={items}>
                    {items.map((id, index) => (
                        <SortableItem
                            key={id}
                            id={id}
                            dummy={dummy}
                            last={index === items.length - 1}
                        />
                    ))}
                </SortableContext>
                {/*<DragOverlay*/}
                {/*    modifiers={[*/}
                {/*        snapCenterToCursor,*/}
                {/*        restrictToVerticalAxis,*/}
                {/*        restrictToParentElement*/}
                {/*    ]}*/}
                {/*>*/}
                {/*    {activeId ? (*/}
                {/*        <SortableItem*/}
                {/*            id={activeId}*/}
                {/*            activeId={activeId}*/}
                {/*            className={"drag-overlay"}*/}
                {/*        />*/}
                {/*    ) : null}*/}
                {/*</DragOverlay>*/}
            </>
        );
    };
    const children = getDraggableItems({ items });
    const dummyChildren = getDraggableItems({ items, dummy: true });

    return (
        <div className="dnd-container" ref={containerRef} style={{ position: "relative" }}>
            <div className="top-fill" style={{ height: topFillHeight }}></div>
            <div id="dnd-context-container" className="dnd-context-container">
                <div
                    id="actual-container"
                    className="actual-container"
                    style={{ position: "relative" }}
                >
                    <DragDropProvider
                        onBeforeDragStart={handleBeforeDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {children}
                    </DragDropProvider>
                </div>
                <div id="shrink-container" style={shrinkContainerStyle}>
                    {dummyChildren}
                </div>
            </div>

            <div className="bottom-fill" style={{ height: bottomFillHeight }}></div>
        </div>
    );
}
