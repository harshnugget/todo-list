export default class TaskPanel {
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
        this.titleElement.addEventListener("click", this.handleTitleChange.bind(this));
        this.dueDateElement.addEventListener("click", this.handleDateChange.bind(this));
        this.priorityElement.addEventListener("change", this.handlePriorityChange.bind(this));
        this.notesElement.addEventListener("click", this.handleNotesInput.bind(this));
        this.notesElement.addEventListener("input", this.changeInputBoxHeight.bind(this));
        this.notesElement.rows = "1";
        this.notesElement.style.overflow = "hidden";
        this.notesElement.style.resize = "none";

        this.clone = this.notesElement.cloneNode();
        this.clone.style.position = "fixed";
        this.clone.style.visibility = "hidden";
        this.panelElement.appendChild(this.clone);
    }

    handleTitleChange(e) {
        e.target.addEventListener("blur", (e) => {
            this.activeTask.title = e.target.value
            const taskTitleElement = this.taskManager.elementMap.get(this.activeTask);
            taskTitleElement.querySelector("span").textContent = e.target.value;
        }, { once: true });
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
        this.titleElement.value = title;
        this.dueDateElement.value = dueDate;
        this.priorityElement.checked = priority === 1 ? true : false;
        this.notesElement.value = notes;
    }

    openTaskPanel(task) {
        this.panelElement.style.display = "";
        if (task) {
           this.updateTaskPanel(task.title, task.dueDate, task.priority, task.notes); 
        }
    }

    closeTaskPanel() {
        this.panelElement.style.display = "none";
    }

    changeInputBoxHeight(e) {
        this.clone.value = e.target.value;

        // Calculate the required number of rows based on scrollHeight
        const scrollHeight = this.clone.scrollHeight;
        const clientHeight = e.target.clientHeight;
        
        // Adjust rows based on content height
        if (scrollHeight > clientHeight) {
            e.target.rows += 1;
        } else if (scrollHeight < clientHeight) {
            e.target.rows -= 1;
        }
    }
}