import { getEventCoordinates } from "@dnd-kit/utilities";

export const snapHandleToCursor = ({ activatorEvent, draggingNodeRect, transform }) => {
    if (draggingNodeRect && activatorEvent) {
        const activatorCoordinates = getEventCoordinates(activatorEvent);

        if (!activatorCoordinates) {
            return transform;
        }

        // Ensure the target is the drag handle
        const handleElement = activatorEvent.target;
        if (!handleElement?.classList.contains("drag-handle")) {
            return transform;
        }

        // Get handle position and size
        const handleParent = handleElement?.parentElement;
        const handleParentRect = handleParent?.getBoundingClientRect();
        const handleRect = handleElement.getBoundingClientRect();

        // Calculate the offsets to center the handle on the cursor
        const offsetHandleX = handleParentRect.left - handleRect.left - handleRect.width / 2;
        const offsetHandleY = handleParentRect.top - handleRect.top - handleRect.height / 2;

        const offsetX = activatorCoordinates.x - draggingNodeRect.left - offsetHandleX;
        const offsetY = activatorCoordinates.y - draggingNodeRect.top - offsetHandleY;

        return {
            ...transform,
            x: transform.x + offsetX - draggingNodeRect.width / 2,
            y: transform.y + offsetY - draggingNodeRect.height / 2
        };
    }

    return transform;
};
