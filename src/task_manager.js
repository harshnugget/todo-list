import { UITools, Manager } from "./manager.js"
import { priorityHighIcon, deleteIcon } from "./images/svg.js";

class TaskManager extends Manager {
    constructor(activeProjectGetter, taskList, updateLocalStorage=null) {
        super(taskList);
        this.activeProjectGetter = activeProjectGetter;
        this.tasks = [];
        this.filterValue = 0;
        this.updateLocalStorage = updateLocalStorage;
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
        
        this.updateLocalStorage();
    }

    clearActiveTask() {
        super.clearActiveObject();
    }

    createTask(task) {
        const obj = super.createObject(task);
        this.activeProject.addTask(task);
        this.createEventListeners(task, obj.element);
        this.clearActiveTask();
        this.togglePrioritySymbol(task, task.priority);

        return { task, element: obj.element }
    }

    removeTask(task) {
        super.removeObject(task);
        this.activeProject.deleteTask(task);
        this.clearActiveTask();

        this.updateLocalStorage();
    }

    createElement(task) {
        const parentElement = super.createElement("task");

        const checkBoxElement = {
            "label": UITools.newElement("label", {"class": "task-status-container"}),
            "input": UITools.newElement("input", {"type": "checkbox"}),
            "span": UITools.newElement("span", {"class": "custom-checkbox"})
        }
        checkBoxElement["input"].checked = task.status;
        checkBoxElement["label"].appendChild(checkBoxElement["input"]);
        checkBoxElement["label"].appendChild(checkBoxElement["span"]);

        if (task.status === true) {
            parentElement.classList.add("completed-task");
        }

        const childElements = {
            "checkbox": checkBoxElement["label"],
            "span": UITools.newElement("span", {}, task.title),
            "priority-icon": UITools.newElement("div", {"class": "priority-icon"}),
            "remove-btn": UITools.newElement("button", {"title": "Delete Task", "type": "button", "class": "remove-task-btn"}, "Remove")
        };
        childElements["priority-icon"].innerHTML = priorityHighIcon;
        childElements["remove-btn"].innerHTML = deleteIcon;

        Object.values(childElements).forEach(element => {
            parentElement.appendChild(element);
        });

        return parentElement;
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.status === false);
    }

    getUncompletedTasks() {
        return this.tasks.filter(task => task.status === true);
    }

    // Handle task filtering
    filterTasks(value=this.filterValue) {
        if (value != this.filterValue) {
            this.filterValue = value;
        } 
       
        let tasks;

        if (value == 0) {
            tasks = this.tasks;
         } else if (value == 1) {
            tasks = this.getCompletedTasks();
         } else if (value == 2) {
            tasks = this.getUncompletedTasks();
         } else {
             console.error('taskFilter: Invalid filter value:', value);
             return;
         }

         this.taskLoader(tasks); 
    }

    createEventListeners(task, element) {
        const labelElement = element.querySelector("label");
        const inputElement = element.querySelector("label > input");
        const removeButton = element.querySelector(":scope > button");

        // Handle task status
        labelElement.addEventListener('click', (e) => {
            if (e.target === inputElement) { 
                task.status = e.target.checked;
                if (e.target.checked) {
                    element.classList.add("completed-task");
                } else {
                    element.classList.remove("completed-task");
                }
                this.togglePrioritySymbol(task, task.priority);
                this.filterTasks();
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

    togglePrioritySymbol(task, priority) {
        const element = this.elementMap.get(task).querySelector(".priority-icon");
        
        if (task.status === true) {
            element.style.visibility = "hidden";
        } else if (priority == 0) {
            element.style.visibility = "hidden";
            task.priority = 0;
        } else if (priority == 1) {
            element.style.visibility = "visible";
            task.priority = 1;
        }

        this.updateLocalStorage();
    }

    taskLoader(tasks) {
        if (this.activeProject && !tasks) {
            tasks = this.activeProject.tasks;
        }
        this.clearActiveTask();
        
        super.objectLoader(tasks);

        this.updateLocalStorage();
    }
}

export default TaskManager;