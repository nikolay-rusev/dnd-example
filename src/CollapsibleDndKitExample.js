import {useState} from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

// Sample data
const initialItems = [
    {
        id: "1",
        title: "Item 1",
        content:
            "This is the content for item 1. It has some detailed information that takes up space.",
    },
    {
        id: "2",
        title: "Item 2",
        content:
            "This is the content for item 2. It has some detailed information that takes up space.",
    },
    {
        id: "3",
        title: "Item 3",
        content:
            "This is the content for item 3. It has some detailed information that takes up space.",
    },
    {
        id: "4",
        title: "Item 4",
        content:
            "This is the content for item 4. It has some detailed information that takes up space.",
    },
];

// SortableItem component that handles individual items
function SortableItem({item, isCollapsed, activeId}) {
    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable({id: item.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "4px",
        marginBottom: "8px",
        padding: "16px",
        cursor: "grab",
        boxShadow:
            item.id === activeId ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <h3 className="font-bold">{item.title}</h3>
            {!isCollapsed && (
                <p className="mt-2 text-gray-600">{item.content}</p>
            )}
        </div>
    );
}

// DragOverlay item to show while dragging
function DragOverlayItem({item}) {
    return (
        <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg">
            <h3 className="font-bold">{item.title}</h3>
            {/* Always collapsed in overlay */}
        </div>
    );
}

export default function CollapsibleDndKitExample() {
    const [items, setItems] = useState(initialItems);
    const [activeId, setActiveId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Configure sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // Handle drag start
    function handleDragStart(event) {
        const {active} = event;
        setActiveId(active.id);
        setIsDragging(true);
    }

    // Handle drag end
    function handleDragEnd(event) {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                );
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
        setIsDragging(false);
    }

    // Find the active item for the overlay
    const activeItem = items.find((item) => item.id === activeId);

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">
                Collapsible Drag and Drop List
            </h2>
            <p className="mb-4 text-gray-600">
                When you start dragging an item, all items will collapse to just
                their titles.
            </p>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div>
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                isCollapsed={isDragging}
                                activeId={activeId}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeItem ? <DragOverlayItem item={activeItem} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
