export default class TaskPanel {
    constructor(taskManager) {
        this.taskManager = taskManager
        
        this.panelElement = document.querySelector("#task-view-panel");
        this.closeButton = this.panelElement.querySelector("#close-task-panel-btn");
        this.titleElement = this.panelElement.querySelector("#task-title");
        this.dueDateElement = this.panelElement.querySelector("#task-due-date");
        this.priorityElement = this.panelElement.querySelector("#task-priority");
        this.notesElement = this.panelElement.querySelector("#task-notes");
        this.removeBtn = this.panelElement.querySelector(".remove-button"); 

        this.setupEventListeners();
        this.setupData();
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
        this.closeButton.addEventListener("click", this.closeTaskPanel.bind(this));
        this.titleElement.addEventListener("click", this.handleTitleChange.bind(this));
        this.dueDateElement.addEventListener("click", this.handleDateChange.bind(this));
        this.priorityElement.addEventListener("change", this.handlePriorityChange.bind(this));
        this.notesElement.addEventListener("click", this.handleNotesInput.bind(this));
        this.notesElement.addEventListener("input", this.updateNotesTextAreaHeight.bind(this));
        this.notesElement.addEventListener("blur", this.updateLocalStorage.bind(this));
        this.removeBtn.addEventListener("click", () => this.taskManager.showDialogElement(this.activeTask));
    }

    setupData() {
        this.closeTaskPanel();

        this.notesElement.style.height = 'auto';
        if (this.notesElement.scrollHeight) {
            this.notesElement.style.height = this.notesElement.scrollHeight + 'px';
        }
    }

    handleTitleChange(e) {
        e.target.addEventListener("blur", (e) => {
            this.activeTask.title = e.target.value
            const taskElement = this.taskManager.elementMap.get(this.activeTask);
            const taskTitleElement = taskElement.querySelector(":scope > span");
            taskTitleElement.textContent = e.target.value;
            this.updateLocalStorage();
        }, { once: true });
    }

    handleDateChange(e) {
        e.target.addEventListener("blur", (e) => {
            this.activeTask.dueDate = e.target.value
            this.updateLocalStorage();
        }, { once: true });
    }

    handlePriorityChange(e) {
        this.taskManager.togglePrioritySymbol(this.activeTask, e.target.value);
    }

    handleNotesInput(e) {
        e.target.addEventListener("blur", (e) => {
            this.activeTask.notes = e.target.value
            this.updateLocalStorage();
        }, { once: true });
    }

    updateTaskPanel(title, dueDate, priority, notes) {
        this.titleElement.value = title;
        this.dueDateElement.value = dueDate;
        this.priorityElement.value = priority;
        this.notesElement.value = notes;
    }

    openTaskPanel(task) {
        this.panelElement.style.display = "";
        if (task) {
           this.updateTaskPanel(task.title, task.dueDate, task.priority, task.notes); 
        }
        this.updateNotesTextAreaHeight();
    }

    closeTaskPanel() {
        this.taskManager.clearActiveTask();
        this.panelElement.style.display = "none";
    }

    updateNotesTextAreaHeight() {
        this.notesElement.style.height = 'auto'; // Reset the height
        this.notesElement.style.height = this.notesElement.scrollHeight + 'px'; // Set the height to match the scroll height
    }

    updateLocalStorage() {
        this.taskManager.updateLocalStorage();
    }
}