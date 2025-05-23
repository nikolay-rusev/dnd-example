import { getActualElementHeight } from "./helpers";

export const calculateFillHeights = ({ event, containerRef, topHandle }) => {
    // scroll offset Y
    const scrollOffset = window.scrollY;

    // Capture the original container height
    const initialHeight = containerRef.current.getBoundingClientRect().height;

    // shrunk container height
    const shrinkContainer = document.getElementById("shrink-container");
    const shrinkContainerHeight = shrinkContainer?.getBoundingClientRect().height;

    // calculate size of elements on top of drag container
    const heightOfElementsBefore = Math.abs(
        containerRef.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top
    );
    console.log("heightOfElementsBefore", heightOfElementsBefore);

    // Calculate remaining space after shrink has happened
    const leftoverHeight = initialHeight - shrinkContainerHeight;

    const activatorEvent = event.activatorEvent;

    // get element for drag-handle case
    const dragHandle = activatorEvent?.srcElement;
    const draggedElement = dragHandle?.parentElement;
    const currentIndex = parseInt(draggedElement?.getAttribute("data-index"));
    const currentShrinkElement = document.querySelector(
        `#shrink-container [data-index="${currentIndex}"]`
    );

    const shrinkElementHeight = getActualElementHeight(currentShrinkElement);
    console.log("shrinkElementHeight", shrinkElementHeight);
    const draggedElementHeight = getActualElementHeight(draggedElement);
    console.log("draggedElementHeight", draggedElementHeight);

    // remove height of the elements before the drag container from mouse y, adjust with scrollOffset also
    const mouseY = activatorEvent.clientY + scrollOffset - heightOfElementsBefore;
    console.log("mouseY", mouseY);

    const draggedElementTop = draggedElement.getBoundingClientRect().top;
    const draggedElementParentTop = draggedElement?.parentElement.getBoundingClientRect().top;
    // distance from top of drag container to the top of dragged element
    let realHeight = Math.abs(draggedElementTop - draggedElementParentTop);
    if (draggedElementTop < 0) {
        realHeight = Math.abs(draggedElementParentTop - draggedElementTop);
    }
    console.log("realHeight", realHeight);

    const shrinkElementTop = currentShrinkElement.getBoundingClientRect().top;
    const shrinkElementParentTop = currentShrinkElement?.parentElement.getBoundingClientRect().top;
    // distance from top of shrink container to the top of shrink element
    let shrinkHeight = Math.abs(shrinkElementTop - shrinkElementParentTop);
    if (shrinkElementTop < 0) {
        shrinkHeight = Math.abs(shrinkElementParentTop - shrinkElementTop);
    }
    console.log("shrinkHeight", shrinkHeight);

    // mouse distance from top of dragged element to mouse point in dragged element
    const mouseYInRectangle = mouseY - realHeight;
    console.log("mouseYInRectangle", mouseYInRectangle);
    // radio for calculating the mouse point in shrunk element
    const ratio = mouseYInRectangle / draggedElementHeight;
    console.log("ratio", ratio);
    // hypothetical mouse distance from top of shrink element to mouse point in shrink element
    // depend on the position of the handle
    const handleAdjustment = topHandle
        ? mouseYInRectangle * (1 + ratio)
        : ratio * shrinkElementHeight; // side positioned handle
    const topCompensation = mouseY - shrinkHeight - handleAdjustment;
    console.log("topCompensation", topCompensation);

    // easy
    const bottomCompensation = leftoverHeight - topCompensation;

    return {
        top: topCompensation,
        bottom: bottomCompensation
    };
};
