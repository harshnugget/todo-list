import { UITools, Manager } from "./manager.js"

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
        this.clearActiveTask();
        super.objectLoader(this.tasks);
    }
}

class TaskPanel {
    constructor(taskManager) {
        this.taskManager = taskManager
        
        this.panelElement = document.querySelector("#task-view-panel");
        this.titleElement = this.panelElement.querySelector("#task-title");
        this.dueDateElement = this.panelElement.querySelector("#task-due-date");
        this.priorityElement = this.panelElement.querySelector("#task-priority");
        this.notesElement = this.panelElement.querySelector("#task-notes");

        this.setupEventListeners();
    }

    get activeTask() {
        return this.taskManager.activeTask;
    }

    setupEventListeners() {
        document.addEventListener("click", (e) => {
            if (!this.activeTask) {
                this.closeTaskPanel();
            }
        });
        this.dueDateElement.addEventListener("click", this.handleDateChange.bind(this));
        this.priorityElement.addEventListener("change", this.handlePriorityChange.bind(this));
        this.notesElement.addEventListener("click", this.handleNotesInput.bind(this));
    }

    handleDateChange(e) {
        e.target.addEventListener("blur", (e) => this.activeTask.dueDate = e.target.value, { once: true });
    }

    handlePriorityChange(e) {
        this.activeTask.priority = e.target.checked === true ? 1 : 0;
    }

    handleNotesInput(e) {
        e.target.addEventListener("blur", (e) => this.activeTask.notes = e.target.value, { once: true });
    }

    updateTaskPanel(title, dueDate, priority, notes) {
        this.titleElement.textContent = title;
        this.dueDateElement.value = dueDate;
        this.priorityElement.checked = priority === 1 ? true : false;
        this.notesElement.value = notes;
    }

    openTaskPanel(task) {
        this.panelElement.style.display = "block";
        if (task) {
           this.updateTaskPanel(task.title, task.dueDate, task.priority, task.notes); 
        }
    }

    closeTaskPanel() {
        this.panelElement.style.display = "none";
    }
}

export default TaskManager
export { TaskPanel };