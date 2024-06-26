import { UITools, Manager } from "./manager.js"
import { priorityHighSymbol } from "./images/svg.js";

class TaskManager extends Manager {
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
            "priority-symbol": UITools.newElement("div", {"class": "priority-symbol"}),
            "remove-btn": UITools.newElement("button", {"type": "button", "class": "remove-task-btn"}, "Remove")
        };
        childElements["input"].checked = task.status === true;
        childElements["priority-symbol"].innerHTML = priorityHighSymbol;
        childElements["priority-symbol"].style.visibility = "hidden";

        Object.values(childElements).forEach(element => {
            UITools.appendElement(parentElement, element);
        });

        return parentElement;
    }

    createEventListeners(task, element) {
        const inputElement = element.querySelector("input");
        const titleElement = element.querySelector("span");
        const removeButton = element.querySelector("button");

        element.addEventListener("click", (e) => {
            switch(e.target) {
                case inputElement:
                    task.status = e.target.checked;
                    if (e.target.checked) {
                        titleElement.classList.add("completed-task");
                        this.togglePrioritySymbol(task, 0);
                    } else {
                        titleElement.classList.remove("completed-task");
                        this.togglePrioritySymbol(task, task.priority);
                    }
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

    getCompletedTasks() {
        const tasks = this.tasks.filter(task => task.status === false);
        return tasks;
    }

    getUncompletedTasks() {
        const tasks = this.tasks.filter(task => task.status === true);
        return tasks;
    }

    togglePrioritySymbol(task, priority) {
        const element = this.elementMap.get(task);

        if (priority == 0) {
            element.querySelector(".priority-symbol").style.visibility = "hidden";
        } else if (priority == 1) {
            element.querySelector(".priority-symbol").style.visibility = "visible";
        }
    }

    taskLoader(filter=0) {
        if (!this.activeProject) {
            this.tasks = [];
        }
        this.clearActiveTask();
 
        if (filter === 0) {
           super.objectLoader(this.tasks); 
        } else if (filter === 1) {
            super.objectLoader(this.getCompletedTasks());
        } else if (filter === 2) {
            super.objectLoader(this.getUncompletedTasks());
        } else {
            console.error('taskLoader: Invalid filter value:', filter);
        }  
    }
}

export default TaskManager;