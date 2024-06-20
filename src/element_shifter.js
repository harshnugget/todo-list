export default class ElementShifter {
    constructor(list, callback=null) {
        this.parentNode = list;
        this.nodeList = Array.from(this.parentNode.children);
        this.elementPosTracker = new WeakMap();
        this.callback = callback;
    }

    updateCoordinates() {
        this.nodeList.forEach(element => {
            const coords = element.getBoundingClientRect();
            const updateThisElement = this.elementPosTracker.get(element);
            if (updateThisElement) {
                updateThisElement.previousCoords = updateThisElement.currentCoords;
                updateThisElement.currentCoords = coords;
            } else {
                this.elementPosTracker.set(element, {
                    previousCoords: null,
                    currentCoords: coords
                });
            }
        })
    }

    animateShift(transitionType="ease", speed="0.5", callback=null) {
        for (let i = this.nodeList.length; i >= 0; i--) {
            let element = this.nodeList[i];

            const updateThisElement = this.elementPosTracker.get(element);
            if (updateThisElement && updateThisElement.previousCoords && updateThisElement.currentCoords) {
                const x = updateThisElement.previousCoords.left - updateThisElement.currentCoords.left;
                const y = updateThisElement.previousCoords.top - updateThisElement.currentCoords.top;
                
                element.style.position = "relative";
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;

                element.style.transition = `transform ${speed}s ${transitionType}`;
                element.style.transform = `translate(${-x}px, ${-y}px)`;

                const transitionEndHandler = () => {
                    element.style.position = "";
                    element.style.left = "";
                    element.style.top = "";
                    element.style.transform = "";
                    element.style.transition = "";
                    element.removeEventListener("transitionend", transitionEndHandler);

                    if (callback && i === 0) {
                        callback();
                    }
                };

                element.addEventListener("transitionend", transitionEndHandler);
            }         
        };
    }

    shiftElement(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.nodeList.length || toIndex < 0 || toIndex >= this.nodeList.length) {
            console.warn("shiftElement: Indices out of bounds");
            return this.nodeList;
        }

        // Capture coordinates before shifting
        this.updateCoordinates();

        // Perform the shift
        if (fromIndex < toIndex) {
            if (toIndex === this.nodeList.length - 1) {
                this.parentNode.appendChild(this.nodeList[fromIndex]);
            } else {
                this.parentNode.insertBefore(this.nodeList[fromIndex], this.nodeList[toIndex].nextSibling);
            }
        } else {
            this.parentNode.insertBefore(this.nodeList[fromIndex], this.nodeList[toIndex]);
        }

        // Update nodeList to reflect the new order
        this.nodeList = Array.from(this.parentNode.children);

        // Capture coordinates after shifting
        this.updateCoordinates();

        if (typeof this.callback === "function") {
             this.callback(fromIndex, toIndex);
        }

        return this.nodeList;
    }
}