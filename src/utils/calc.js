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

    // use first element: assume same height elements
    const shrinkElement = shrinkContainer?.firstElementChild;
    const shrinkElementHeight = getActualElementHeight(shrinkElement);

    // use first element: assume same height elements
    const actualContainer = document.getElementById("actual-container");
    const actualElement = actualContainer?.firstElementChild;
    const actualElementHeight = getActualElementHeight(actualElement);

    const activatorEvent = event.activatorEvent;
    // remove outside elements height
    const mouseY = activatorEvent.clientY - heightOfElementsBefore;
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

    return {
        top: topCompensation,
        bottom: bottomCompensation
    };
};
