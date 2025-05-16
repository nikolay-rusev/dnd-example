import { TIMEOUT_SCROLL } from "./constants";

// calc element height + margins
export const getActualElementHeight = (el) => {
    const style = window.getComputedStyle(el);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    return el.getBoundingClientRect().height + marginTop + marginBottom;
};

export const scrollAfterDragEnd = (id) => {
    // Scroll to the final position
    setTimeout(() => {
        document.querySelector(`[data-id=drag-item-${id}]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, TIMEOUT_SCROLL); // Slight delay to allow transition
};
