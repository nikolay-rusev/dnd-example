export const TIMEOUT = 0;
export const TIMEOUT_SCROLL = 200;

export const dragItemsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const dummyContainerStyle = {
    visibility: "hidden",
    zIndex: -1,
    position: "absolute",
    top: 0,
    right: 0
};

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
    transition: "all 0.2s ease",
    width: 150,
    height: 50,
    opacity: 1,
    transform: `translate(0px, 0px)`
};

export const dummyItemStyle = {
    ...defaultItemStyle,
    width: 100,
    height: 30
};
