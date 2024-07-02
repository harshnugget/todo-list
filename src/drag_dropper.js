import Shifter from "./shifter.js";

export default class DragAndDropper extends Shifter {
    constructor(parentNode, objectArrayGetter=null) {
        super(parentNode);
        this.objectArrayGetter = objectArrayGetter;
        this.identifier = "draggable";
        this.dragTimeout = null;
        this.elementBeingDragged = null;
        this.elementHoveredOver = null;
    } 

    createEventListeners = (element) => {
        element.draggable = true;

        element.dataset.identifier = this.identifier;

        element.addEventListener("dragstart", (e) => this.handleDragStart(e));
        element.addEventListener("dragover", (e) => this.handleDragOver(e));
        element.addEventListener("dragend", () => this.handleDragEnd());
    };

    handleDragStart(e) {
        e.target.style.zIndex = "1";
        this.elementBeingDragged = e.target.closest(`[data-identifier="${this.identifier}"]`);
        
        // Add a flag to all elements affected by the drag operation, for styling
        this.nodeList.forEach(e => e.classList.add("drag-flag"));
    } 

    handleDragEnd(e) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
        this.elementBeingDragged.style.zIndex = "";
        this.elementBeingDragged = null;
        this.elementHoveredOver = null;

        // Remove flag from all elements affected by the drag operation, for styling
        this.nodeList.forEach(e => e.classList.remove("drag-flag"));
    }

    handleDragOver(e) {
        // Retrieve the closest target with the specified identifier
        const elementHoveredOverTemp = e.target.closest(`[data-identifier="${this.identifier}"]`);

        if (!elementHoveredOverTemp || !this.elementBeingDragged) {
            return
        }

        this.elementHoveredOver = elementHoveredOverTemp;
        
        if (this.elementBeingDragged !== this.elementHoveredOver && !this.dragTimeout) {
            this.dragTimeout = setTimeout(() => this.shift(), 500);
        }
    }

    shift() {
        const fromIndex = this.nodeList.findIndex(e => e === this.elementBeingDragged);
        const toIndex = this.nodeList.findIndex(e => e === this.elementHoveredOver);

        this.shiftElement(fromIndex, toIndex);
        this.animateShift("ease", "0.5", () => animationEndHandler());

        // Make each element in the nodeList undraggable during animation
        this.nodeList.forEach(e => e.draggable = false);

        const animationEndHandler = () => {
            // Make each element in the nodeList draggable on animation end
            this.nodeList.forEach(e => e.draggable = true);
            this.dragTimeout = null;

            if (this.objectArrayGetter) {
                this.shiftObject(this.objectArrayGetter(), fromIndex, toIndex);
            }
        }
    }
}