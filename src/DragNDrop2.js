import "./styles.css";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";

function Sortable({ id, index }) {
    const { ref } = useSortable({ id, index });

    return (
        <li ref={ref} className="item">
            Item {id}
        </li>
    );
}

export default function DragNDrop2() {
    const items = [1, 2, 3, 4];

    return (
        <DragDropProvider
            onBeforeDragStart={(event) => {
                console.log(event);
                document.getElementById("sortable").style.scale = 0.5;
            }}
            onDragEnd={(event) => {
                console.log(event);
                document.getElementById("sortable").style.scale = 1;
            }}
        >
            <ul id={"sortable"} className="list">
                {items.map((id, index) => (
                    <Sortable key={id} id={id} index={index} />
                ))}
            </ul>
        </DragDropProvider>
    );
}
