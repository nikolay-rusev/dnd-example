import { getActualElementHeight } from "./helpers";

export const calculateFillHeights = ({ event, containerRef }) => {
    // Capture the original container height
    const initialHeight = containerRef.current.getBoundingClientRect().height;

    // shrunk container height
    const shrinkContainer = document.getElementById("shrink-container");
    const shrinkContainerHeight = shrinkContainer?.getBoundingClientRect().height;

    // calculate size of elements before drag container
    const heightOfElementsBefore = containerRef.current.getBoundingClientRect().top;

    // Calculate remaining space
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
    const draggedElementHeight = getActualElementHeight(draggedElement);

    // remove outside elements height
    const mouseY = activatorEvent.clientY - heightOfElementsBefore;

    const draggedElementTop = draggedElement.getBoundingClientRect().top;
    const draggedElementParentTop = draggedElement?.parentElement.getBoundingClientRect().top;
    let realHeight = Math.abs(draggedElementTop - draggedElementParentTop);
    if (draggedElementTop < 0) {
        realHeight = Math.abs(draggedElementParentTop - draggedElementTop);
    }

    const shrinkElementTop = currentShrinkElement.getBoundingClientRect().top;
    const shrinkElementParentTop = currentShrinkElement?.parentElement.getBoundingClientRect().top;
    let shrinkHeight = Math.abs(shrinkElementTop - shrinkElementParentTop);
    if (shrinkElementTop < 0) {
        shrinkHeight = Math.abs(shrinkElementParentTop - shrinkElementTop);
    }

    // from top of dragged el to mouse point in dragged el
    const mouseYInRectangle = mouseY - realHeight;
    // radio for calculating the mouse point in shrunk element
    const ratio = mouseYInRectangle / draggedElementHeight;
    const topCompensation = mouseY - shrinkHeight - ratio * shrinkElementHeight;

    // easy
    const bottomCompensation = leftoverHeight - topCompensation;

    return {
        top: topCompensation,
        bottom: bottomCompensation
    };
};
