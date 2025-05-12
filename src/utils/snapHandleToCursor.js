import { getEventCoordinates } from "@dnd-kit/utilities";

export const snapHandleToCursor = ({ activatorEvent, draggingNodeRect, transform }) => {
    if (draggingNodeRect && activatorEvent) {
        const activatorCoordinates = getEventCoordinates(activatorEvent);
        if (!activatorCoordinates) {
            return transform;
        }

        // Ensure the target is the drag handle
        const handleElement = activatorEvent.target;
        if (!handleElement || !handleElement.classList.contains("drag-handle")) {
            return transform;
        }

        // Get handle position and size
        const handleRect = handleElement.getBoundingClientRect();

        // Calculate the offsets to center the handle on the cursor
        const offsetX = activatorCoordinates.x - handleRect.left - handleRect.width / 2;
        const offsetY = activatorCoordinates.y - handleRect.top - handleRect.height / 2;

        return {
            ...transform,
            x: transform.x + offsetX,
            y: transform.y + offsetY
        };
    }

    return transform;
};
