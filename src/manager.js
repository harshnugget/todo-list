class UITools {
    static newElement(tag, attributes = {}, textContent = "") {
        const element = document.createElement(tag);

        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }

        element.textContent = textContent;
        return element;
    }

    static getElementIndex(element) {
        const array = Array.from(element.parentNode.children);
        return array.findIndex(e => e === element);
    }
}

class Manager {
    constructor(container) {
        this._activeObject = null;
        this.container = container;
        this.elementMap = new WeakMap();
    }

    get activeObject() {
        return this._activeObject;
    }

    set activeObject(object) {
        if (!object) {
            this.clearActiveObject();
        } else if (this.activeObject === object) return; 

        const element = this.elementMap.get(object);
        if (element) {
            this.clearActiveObject();
            element.classList.add("active");
        }

        this._activeObject = object;
    }

    clearActiveObject() {
        this._activeObject = null;
        const activeElement = this.container.querySelector(".active");
        if (activeElement) {
            activeElement.classList.remove("active");
        }
    }

    createObject(object) {
        const element = this.loadElement(object);
        this.elementMap.set(object, element);

        return { object, element };
    }

    createElement(object) {
        const className = object.constructor.name.toLowerCase()
        const element = UITools.newElement("li", {"class": `${className}`});

        return element;
    }

    loadElement(object) {
        const element = this.createElement(object);

        if (!element) {
            throw ReferenceError("loadElement: No parentElement provided");
        }

        this.container.appendChild(element);

        return element;
    }

    removeObject(object) {
        const element = this.elementMap.get(object);
        element.remove();
        if (object === this.activeObject) {
            this.activeObject = null;
        }
    }

    objectLoader(objects) {
        this.container.innerHTML = "";

        if (!objects) return

        this.clearActiveObject();

        if (objects.length > 0) {
            objects.forEach(object => {
                let element = this.elementMap.get(object);
                this.container.append(element);
            });
        }
    }
}

export { UITools, Manager };