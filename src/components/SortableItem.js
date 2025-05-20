import { useSortable } from "@dnd-kit/sortable";
import {
    defaultItemStyle,
    dragHandleStyle,
    dummyItemStyle,
    REGULAR_HEIGHT,
    SHRUNK_HEIGHT
} from "../utils/constants";
import { getRandomInt } from "../utils/helpers";

export const calcItemStyle = ({ activeId, transform, last }) => {
    return {
        ...defaultItemStyle,
        height: activeId ? SHRUNK_HEIGHT : REGULAR_HEIGHT + getRandomInt(300),
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        marginBottom: last ? 0 : 8
    };
};

export function SortableItem({ id, activeId, dummy, last, className }) {
    const { attributes, setNodeRef, transform, listeners } = useSortable({ id });

    // last item has no bottom margin
    const itemStyle = dummy ? dummyItemStyle : calcItemStyle({ activeId, transform, last });

    // put ids in actual elements for easier detection
    const dragItemId = dummy ? null : `drag-item-${id}`;

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={itemStyle}
            data-id={dragItemId}
            data-index={id}
            className={className}
        >
            <div {...listeners} className={"drag-handle"} style={dragHandleStyle}>
                ☰
            </div>
            {id}
        </div>
    );
}
