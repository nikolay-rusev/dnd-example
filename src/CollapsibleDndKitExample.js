import {useState, useRef, useEffect} from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    MeasuringStrategy,
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
function SortableItem({item, isCollapsed, activeId, measureRef}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: item.id});

    const ref = useRef(null);

    // Combined ref function that sets both the sortable ref and our measurement ref
    const setRefs = (node) => {
        setNodeRef(node);
        ref.current = node;
        if (measureRef && item.id === activeId) {
            measureRef.current = node;
        }
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : transition,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "4px",
        marginBottom: "8px",
        padding: "16px",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        boxShadow:
            item.id === activeId ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none",
        height: isDragging && isCollapsed ? "auto" : undefined,
    };

    return (
        <div ref={setRefs} style={style} {...attributes} {...listeners}>
            <h3 className="font-bold">{item.title}</h3>
            {(!isCollapsed || (isDragging && item.id === activeId)) && (
                <p className="mt-2 text-gray-600">{item.content}</p>
            )}
        </div>
    );
}

// This component is no longer used as we're rendering directly in DragOverlay
// Keeping this for reference in case you want to use it later
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
    const [initialHeight, setInitialHeight] = useState(0);
    const [collapsedHeight, setCollapsedHeight] = useState(0);
    const activeItemRef = useRef(null);

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

    // Custom drop animation that adjusts for height change
    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    // Handle drag start
    function handleDragStart(event) {
        const {active} = event;
        setActiveId(active.id);

        // If we have a reference to the active item, measure its height before collapsing
        if (activeItemRef.current) {
            const originalHeight =
                activeItemRef.current.getBoundingClientRect().height;
            setInitialHeight(originalHeight);

            // We need to wait for a frame to measure collapsed height
            requestAnimationFrame(() => {
                setIsDragging(true);
                requestAnimationFrame(() => {
                    if (activeItemRef.current) {
                        const newHeight =
                            activeItemRef.current.getBoundingClientRect()
                                .height;
                        setCollapsedHeight(newHeight);
                    }
                });
            });
        } else {
            setIsDragging(true);
        }
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
        setInitialHeight(0);
        setCollapsedHeight(0);
    }

    // Find the active item for the overlay
    const activeItem = items.find((item) => item.id === activeId);

    // Calculate modifier for cursor position
    const modifiers = activeId
        ? [
              ({transform}) => {
                  // Only apply the offset if we have both heights
                  if (
                      initialHeight &&
                      collapsedHeight &&
                      initialHeight > collapsedHeight
                  ) {
                      // Calculate the center point difference to adjust
                      const offsetY = (initialHeight - collapsedHeight) / 2;
                      return {
                          ...transform,
                          y: transform.y - offsetY,
                      };
                  }
                  return transform;
              },
          ]
        : [];

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
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
                modifiers={modifiers}
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
                                measureRef={activeItemRef}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeItem ? (
                        <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg">
                            <h3 className="font-bold">{activeItem.title}</h3>
                            {/* Always collapsed in overlay */}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
