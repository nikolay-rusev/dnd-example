import {
    defaultItemStyle,
    REGULAR_HEIGHT,
    REGULAR_WIDTH,
    SHRUNK_HEIGHT,
    SHRUNK_WIDTH
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
        width: activeId ? SHRUNK_WIDTH : REGULAR_WIDTH,
        height: activeId ? SHRUNK_HEIGHT : REGULAR_HEIGHT,
        opacity: activeId ? 0.5 : 1,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        marginBottom: last ? 0 : 8
    };
};
