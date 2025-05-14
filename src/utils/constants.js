export const TIMEOUT = 0;
export const TIMEOUT_SCROLL = 200;
export const REGULAR_WIDTH = 300;
export const REGULAR_HEIGHT = 120;
export const SHRUNK_WIDTH = 30;
export const SHRUNK_HEIGHT = 12;

export const dragItemsArray = [1, 2, 3, 4, 5, 6];

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
    marginBottom: 8,
    background: "lightblue",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for drag handle placement
    padding: "5px",
    transition: "all 0.2s ease",
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
