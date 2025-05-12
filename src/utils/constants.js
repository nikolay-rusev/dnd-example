export const TIMEOUT = 0;

export const dragItemsArray = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
    "Item 12"
];

export const dummyContainerStyle = {
    visibility: "hidden",
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0
}

export const dragHandleStyle = {
    cursor: "grab",
    padding: "5px",
    background: "darkblue",
    color: "white",
    borderRadius: "4px"
};

export const defaultItemStyle = {
    marginBottom: 8,
    background: "lightblue",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for drag handle placement
    padding: "5px",
    transition: "height 0.2s ease",
    width: 150,
    height: 50,
    opacity: 1,
    transform: `translate(0px, 0px)`
};

export const dummyItemStyle = {
    ...defaultItemStyle,
    width: 100,
    height: 30,
    opacity: 1,
    transform: `translate(0px, 0px)`
}