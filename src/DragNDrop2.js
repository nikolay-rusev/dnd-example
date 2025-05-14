import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { SortableContext } from "@dnd-kit/sortable";
import { dragItemsArray, dummyItemStyle, shrinkContainerStyle, TIMEOUT } from "./utils/constants";
import { calcItemStyleForDND2, getActualElementHeight } from "./utils/helpers";
import { useRef, useState } from "react";

function SortableItem({ id, index, isDragging, dummy, last, className }) {
    const sortable = useSortable({ id, index });

    const itemStyle = dummy ? dummyItemStyle : calcItemStyleForDND2({ isDragging, last });

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
    const [isDragging, setIsDragging] = useState(false);
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

        // Get the context container height after shrinking (assuming transitions complete)
        setTimeout(() => {
            const activatorEvent = event.operation.activatorEvent;
            const mouseY = activatorEvent?.clientY;
            // get element
            const draggedElement = activatorEvent?.srcElement;
            const topOfDraggedElement = draggedElement.getBoundingClientRect().top;
            const currentIndex = parseInt(draggedElement?.getAttribute("data-index"));

            const currentShrinkElement = document.querySelector(
                `#shrink-container [data-index="${currentIndex}"]`
            );
            const topOfShrinkEl = Math.abs(
                currentShrinkElement.getBoundingClientRect().top -
                    currentShrinkElement?.parentElement.getBoundingClientRect().top
            );

            // height between top corner of dragged element and mouse point y
            const adjust = mouseY - topOfDraggedElement;
            // ratio to adjust for shrink element
            const ratio = adjust / actualElementHeight;
            const topCompensation =
                topOfDraggedElement - topOfShrinkEl + adjust - shrinkElementHeight * ratio;

            const bottomCompensation = leftoverHeight - topCompensation;

            setTopFillHeight(topCompensation);
            setBottomFillHeight(bottomCompensation);
        }, TIMEOUT); // Ensuring transition has completed
    };

    const handleBeforeDragStart = (event) => {
        if (!containerRef.current) return;
        setIsDragging(true);

        calculateFillHeights({ event });
    };

    const handleDragEnd = (event) => {
        setIsDragging(false);

        // const draggedItem = event.operation.source;
        // reset of fill heights
        resetFillHeights();

        return setItems((items) => move(items, event));
    };

    const getDraggableItems = ({ items, dummy = false }) => {
        return (
            <SortableContext items={items}>
                {items.map((id, index) => (
                    <SortableItem
                        key={id}
                        id={id}
                        isDragging={isDragging}
                        index={index}
                        dummy={dummy}
                        last={index === items.length - 1}
                    />
                ))}
            </SortableContext>
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
