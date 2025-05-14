import {
    defaultItemStyle,
    REGULAR_HEIGHT,
    REGULAR_WIDTH,
    SHRUNK_HEIGHT,
    SHRUNK_WIDTH,
    TIMEOUT_SCROLL
} from "./constants";

export const getActualElementHeight = (el) => {
    const style = window.getComputedStyle(el);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    return el.getBoundingClientRect().height + marginTop + marginBottom;
};

export const calcItemStyle = ({ shrink, last }) => {
    return {
        ...defaultItemStyle,
        width: shrink ? SHRUNK_WIDTH : REGULAR_WIDTH,
        height: shrink ? SHRUNK_HEIGHT : REGULAR_HEIGHT,
        opacity: shrink ? 0.5 : 1,
        marginBottom: last ? 0 : 8
    };
};

export const scrollAfterDragEnd = (event) => {
    // Scroll to the final position
    setTimeout(() => {
        document.querySelector(`[data-id=drag-item-${event.active.id}]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, TIMEOUT_SCROLL); // Slight delay to allow transition
};

export const scrollActiveElementIntoView = (id) => {
    document.querySelector(`[data-id=drag-item-${id}]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
};
