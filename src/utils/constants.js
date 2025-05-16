export const TIMEOUT = 0;
export const TIMEOUT_SCROLL = 200;
export const REGULAR_WIDTH = "300px";
export const REGULAR_HEIGHT = "120px";
export const SHRUNK_WIDTH = "30px";
export const SHRUNK_HEIGHT = "12px";
export const OUTER_CONTENT_HEIGHT = "450px";
export const TRANSITION = "all 0.3s ease"

export const dragItemsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const shrinkContainerStyle = {
    visibility: "visible",
    position: "absolute",
    top: 0,
    right: 0
};

export const dragHandleStyle = {
    cursor: "grab",
    padding: "1px",
    background: "darkblue",
    color: "white",
    borderRadius: "1px"
};

export const defaultItemStyle = {
    marginBottom: "8px",
    background: "lightblue",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for drag handle placement
    padding: "5px",
    transition: TRANSITION,
    width: REGULAR_WIDTH,
    height: REGULAR_HEIGHT,
    opacity: 1,
    transform: `translate(0px, 0px)`
};

export const dummyItemStyle = {
    ...defaultItemStyle,
    width: SHRUNK_WIDTH,
    height: SHRUNK_HEIGHT
};
