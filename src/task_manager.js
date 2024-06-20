import { UITools, Manager } from "./manager.js"

export default class TaskManager extends Manager {
    constructor(activeProjectGetter, taskList) {
        super(taskList);
        this.activeProjectGetter = activeProjectGetter;
        this.tasks = [];
    }

    get activeProject() {
        const activeProject = this.activeProjectGetter();
        if (activeProject) {
            this.tasks = activeProject.tasks;
        }

        return activeProject;
    }

    get activeTask() {
        return super.activeObject;
    }

    set activeTask(task) {
        super.activeObject = task;
    }

    clearActiveTask() {
        super.clearActiveObject();
    }

    createTask(task) {
        const obj = super.createObject(task);
        this.activeProject.addTask(task);
        this.createEventListeners(task, obj.element);
        this.clearActiveTask();

        return { task, element: obj.element }
    }

    removeTask(task) {
        super.removeObject(task);
        this.activeProject.deleteTask(task);
        this.clearActiveTask();
    }

    createElement(task) {
        const parentElement = super.createElement(task);
        const childElements = {
            "input": UITools.newElement("input", {"type": "checkbox"}),
            "span": UITools.newElement("span", {}, task.title),
            "remove-btn": UITools.newElement("button", {}, "Remove")
        };
        childElements["input"].checked = task.status === true;

        Object.values(childElements).forEach(element => {
            UITools.appendElement(parentElement, element);
        });

        return parentElement;
    }

    createEventListeners(task, element) {
        const inputElement = element.querySelector("input");
        const removeButton = element.querySelector("button");

        element.addEventListener("click", (e) => {
                switch(e.target) {
                    case inputElement:
                        task.status = e.target.checked;
                        return;
                    case removeButton:
                        this.removeTask(task);
                        return;
                    default:
                        if (task === this.activeTask) {
                            this.clearActiveTask();
                        } else {
                             this.activeTask = task;
                        }
                }
        });
    }

    taskLoader() {
        if (!this.activeProject) {
            this.tasks = [];
        }
        super.objectLoader(this.tasks);
    }
}