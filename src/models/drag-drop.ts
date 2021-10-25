export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
    // Makes sure you have a valid drag target (can drop here)
    dragOverHandler(event: DragEvent): void;
    // React to drop that happens (update data)
    dropHandler(event: DragEvent): void;
    // Visual feedback to user if drop doesn't happen
    dragLeaveHandler(event: DragEvent): void;
}
