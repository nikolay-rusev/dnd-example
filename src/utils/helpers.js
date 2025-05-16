import { TIMEOUT_SCROLL } from "./constants";

export const getActualElementHeight = (el) => {
    const style = window.getComputedStyle(el);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    return el.getBoundingClientRect().height + marginTop + marginBottom;
};

export const scrollAfterDragEnd = (event) => {
    // Scroll to the final position
    setTimeout(() => {
        document.querySelector(`[data-id=drag-item-${event.active.id}]`)?.scrollIntoView({
            behavior: "auto",
            block: "nearest"
        });
    }, TIMEOUT_SCROLL); // Slight delay to allow transition
};
