import {useState} from "react";
import {
    DndContext,
    DragOverlay,
    MeasuringStrategy,
    pointerWithin,
} from "@dnd-kit/core";
import {snapCenterToCursor} from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, useSortable} from "@dnd-kit/sortable";
import {dragItemsArray} from "./utils/constants";

function SortableItem({id, className}) {
    const {attributes, setNodeRef, listeners} = useSortable({id});

    const dragItemId = `drag-item-${id}`;

    return (
        <div
            ref={setNodeRef}
            data-id={dragItemId}
            data-index={id}
            {...attributes}
            {...listeners}
            className={className}
        >
            {id}
        </div>
    );
}

export default function DragNDrop() {
    const [items, setItems] = useState(dragItemsArray);
    const [activeId, setActiveId] = useState(null);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);

        const {active, over} = event;

        if (over) {
            setItems((prev) =>
                arrayMove(prev, prev.indexOf(active.id), prev.indexOf(over.id)),
            );
        }
    };

    const getDraggableItems = ({activeId, items, dummy = false}) => {
        return (
            <>
                <SortableContext items={items}>
                    {items.map((id) => (
                        <SortableItem
                            key={id}
                            id={id}
                            className={"sortable-item"}
                        />
                    ))}
                </SortableContext>
                <DragOverlay modifiers={[snapCenterToCursor]}>
                    {activeId ? (
                        <SortableItem
                            id={activeId}
                            activeId={activeId}
                            className={"drag-overlay"}
                        />
                    ) : null}
                </DragOverlay>
            </>
        );
    };

    const children = getDraggableItems({activeId, items});

    return (
        <div className={"sortable-container"}>
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={pointerWithin}
                autoScroll={{layoutShiftCompensation: true}}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
            >
                {children}
            </DndContext>
        </div>
    );
}
