export const TIMEOUT = 0;
export const TIMEOUT_SCROLL = 200;
export const REGULAR_WIDTH = "300px";
export const REGULAR_HEIGHT = "400px";
export const SHRUNK_HEIGHT = "40px";
export const OUTER_CONTENT_HEIGHT = "450px";
export const TRANSITION = "all 0.4s ease";

export const shrinkContainerStyle = {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    right: 0
};

export const dragHandleStyle = {
    width: "100%",
    cursor: "grab",
    padding: "1px",
    background: "darkblue",
    color: "white",
    borderRadius: "1px"
};

// default sortable item style
export const defaultItemStyle = {
    marginBottom: "8px",
    background: "lightblue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for drag handle placement
    padding: "5px",
    transition: TRANSITION,
    width: REGULAR_WIDTH,
    height: REGULAR_HEIGHT,
    transform: `translate(0px, 0px)`
};

// default shrink item style
export const dummyItemStyle = {
    ...defaultItemStyle,
    height: SHRUNK_HEIGHT
};
