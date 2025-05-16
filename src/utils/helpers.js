import {
    defaultItemStyle,
    REGULAR_HEIGHT,
    // REGULAR_WIDTH,
    SHRUNK_HEIGHT,
    // SHRUNK_WIDTH,
    TIMEOUT_SCROLL
} from "./constants";

export const getActualElementHeight = (el) => {
    const style = window.getComputedStyle(el);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    return el.getBoundingClientRect().height + marginTop + marginBottom;
};

export const calcItemStyle = ({ activeId, transform, last }) => {
    return {
        ...defaultItemStyle,
        // width: activeId ? SHRUNK_WIDTH : REGULAR_WIDTH,
        height: activeId ? SHRUNK_HEIGHT : REGULAR_HEIGHT,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        marginBottom: last ? 0 : "8px"
    };
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
