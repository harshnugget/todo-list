import { UITools, Manager } from "./manager.js"
import { priorityHighIcon, deleteIcon } from "./images/svg.js";

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

        const checkBoxElement = {
            "label": UITools.newElement("label", {"class": "task-status-container"}),
            "input": UITools.newElement("input", {"type": "checkbox"}),
            "span": UITools.newElement("span", {"class": "custom-checkbox"})
        }
        checkBoxElement["input"].checked = task.status === true;
        checkBoxElement["label"].appendChild(checkBoxElement["input"]);
        checkBoxElement["label"].appendChild(checkBoxElement["span"]);

        const childElements = {
            "checkbox": checkBoxElement["label"],
            "span": UITools.newElement("span", {}, task.title),
            "priority-icon": UITools.newElement("div", {"class": "priority-icon"}),
            "remove-btn": UITools.newElement("button", {"type": "button", "class": "remove-task-btn"}, "Remove")
        };
        childElements["priority-icon"].innerHTML = priorityHighIcon;
        childElements["priority-icon"].style.visibility = "hidden";
        childElements["remove-btn"].innerHTML = deleteIcon;

        Object.values(childElements).forEach(element => {
            parentElement.appendChild(element);
        });

        return parentElement;
    }

    createEventListeners(task, element) {
        const labelElement = element.querySelector("label");
        const inputElement = element.querySelector("label > input");
        const removeButton = element.querySelector(":scope > button");

        labelElement.addEventListener('click', (e) => {
            if (e.target === inputElement) { 
                task.status = e.target.checked;
                if (e.target.checked) {
                    element.classList.add("completed-task");
                    this.togglePrioritySymbol(task, 0);
                } else {
                    element.classList.remove("completed-task");
                    this.togglePrioritySymbol(task, task.priority);
                }
            }
            e.stopPropagation();
          });

        element.addEventListener("click", (e) => {
            switch(e.target) {
                case removeButton:
                    this.showDialogElement(task);
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

    showDialogElement(task) {
        const parentElement = UITools.newElement("dialog", {"class": "remove-item-dialog"});
        const childElements = {
            "title": UITools.newElement("h2", {}, `${task.title}`),
            "p": UITools.newElement("p", {}, `Are you sure you want to remove this task?`),
            "yes-btn": UITools.newElement("button", {"type": "button"}, "Yes"),
            "no-btn": UITools.newElement("button", {"type": "button"}, "No"),
        };
        Object.values(childElements).forEach(element => {
            parentElement.appendChild(element);
        });

        this.container.appendChild(parentElement);

        // Event listeners
        childElements["yes-btn"].addEventListener("click", (e) => {
            parentElement.remove()
            this.removeTask(task)
        });

        childElements["no-btn"].addEventListener("click", (e) => {
            parentElement.remove()
        });

        // Display the dialog
        parentElement.showModal();
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
        const element = this.elementMap.get(task).querySelector(".priority-icon");

        if (priority == 0) {
            element.style.visibility = "hidden";
        } else if (priority == 1) {
            element.style.visibility = "visible";
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