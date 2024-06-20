import Shifter from "./shifter.js";

export default class DragAndDropper extends Shifter {
    constructor(parentNode, objectArrayGetter=null) {
        super(parentNode);
        this.objectArrayGetter = objectArrayGetter;
        this.identifier = "draggable";
        this.dragOverFlag = false;
        this.dragDelay = null;
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
        this.elementBeingDragged = e.target;

        // Update the nodeList
        this.nodeList = Array.from(this.elementBeingDragged.parentNode.children);
    } 

    handleDragEnd() {
        clearTimeout(this.dragDelay);
        this.dragOverFlag = false;
        this.elementBeingDragged = null;
        this.elementHoveredOver = null;
    }

    handleDragOver(e) {
        // Retrieve the closest target with the specified identifier
        const elementHoveredOverTemp = e.target.closest(`[data-identifier="${this.identifier}"]`);

        if (!elementHoveredOverTemp || !this.elementBeingDragged) {
            return
        }

        this.elementHoveredOver = elementHoveredOverTemp;

        if (this.elementBeingDragged !== this.elementHoveredOver && !this.dragOverFlag) {
            this.dragOverFlag = true;

            const dragDelayTimeout = () => {
                const fromIndex = this.nodeList.findIndex(e => e === this.elementBeingDragged);
                const toIndex = this.nodeList.findIndex(e => e === this.elementHoveredOver);

                this.shiftElement(fromIndex, toIndex);
                this.animateShift("ease", "0.5", animationEndHandler.bind(this));

                // Make each element in the nodeList undraggable during animation
                this.nodeList.forEach(e => e.draggable = false);

                function animationEndHandler() {
                    // Make each element in the nodeList draggable on animation end
                    this.nodeList.forEach(e => e.draggable = true);
                    this.dragOverFlag = false;

                    if (this.objectArrayGetter) {
                        this.shiftObject(this.objectArrayGetter(), fromIndex, toIndex);
                    }
                }
            }

            this.dragDelay = setTimeout(() => dragDelayTimeout(), 500);
        }
    }
}