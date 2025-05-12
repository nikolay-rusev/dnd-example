import { getEventCoordinates } from "@dnd-kit/utilities";

/**
 * Modifier function to snap the drag handle directly under the cursor.
 * @param {Object} params - DndKit modifier parameters
 * @returns {Object} Updated transform object
 */
export const snapHandleToCursor = ({ activatorEvent, draggingNodeRect, transform }) => {
    if (draggingNodeRect && activatorEvent) {
        const activatorCoordinates = getEventCoordinates(activatorEvent);
        if (!activatorCoordinates) {
            return transform;
        }

        // Get the handle's bounding rect
        const handleElement = activatorEvent.target;
        if (!handleElement || !handleElement.classList.contains("drag-handle")) {
            return transform; // Ensure we're working with the handle
        }

        const handleRect = handleElement.getBoundingClientRect();

        // Calculate the offset based on handle position rather than the whole element
        const offsetX = activatorCoordinates.x - handleRect.left;
        const offsetY = activatorCoordinates.y - handleRect.top;

        return {
            ...transform,
            x: transform.x + offsetX - handleRect.width / 2,
            y: transform.y + offsetY - handleRect.height / 2,
        };
    }

    return transform;
};
