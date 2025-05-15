import { getActualElementHeight } from "./helpers";

export const calculateFillHeights = ({ event, containerRef }) => {
    // scroll offset on y
    const scrollOffset = window.scrollY;

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
    
    const realHeight = Math.abs(
        draggedElement.getBoundingClientRect().top -
            draggedElement?.parentElement.getBoundingClientRect().top
    );

    const shrinkHeight = Math.abs(
        currentShrinkElement.getBoundingClientRect().top -
            currentShrinkElement?.parentElement.getBoundingClientRect().top
    );

    const mouseYInRectangle = mouseY - realHeight;
    const ratio = mouseYInRectangle / draggedElementHeight;
    const topCompensation = mouseY - shrinkHeight - ratio * shrinkElementHeight;

    // easy
    const bottomCompensation = leftoverHeight - topCompensation;

    return {
        top: topCompensation,
        bottom: bottomCompensation
    };
};
