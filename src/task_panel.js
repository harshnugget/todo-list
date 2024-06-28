export default class TaskPanel {
    constructor(taskManager) {
        this.taskManager = taskManager
        
        this.panelElement = document.querySelector("#task-view-panel");
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
        this.titleElement.addEventListener("click", this.handleTitleChange.bind(this));
        this.dueDateElement.addEventListener("click", this.handleDateChange.bind(this));
        this.priorityElement.addEventListener("change", this.handlePriorityChange.bind(this));
        this.notesElement.addEventListener("click", this.handleNotesInput.bind(this));
        this.notesElement.addEventListener("input", this.changeInputBoxHeight.bind(this));
        this.removeBtn.addEventListener("click", () => this.taskManager.showDialogElement(this.activeTask));
    }

    setupData() {
        this.notesElement.rows = "1";
        this.notesElement.style.resize = "none";
        this.notesElement.style.overflow = "hidden";    // This is important to have on the clone
    }

    handleTitleChange(e) {
        e.target.addEventListener("blur", (e) => {
            this.activeTask.title = e.target.value
            const taskElement = this.taskManager.elementMap.get(this.activeTask);
            const taskTitleElement = taskElement.querySelector(":scope > span");
            taskTitleElement.textContent = e.target.value;
        }, { once: true });
    }

    handleDateChange(e) {
        e.target.addEventListener("blur", (e) => this.activeTask.dueDate = e.target.value, { once: true });
    }

    handlePriorityChange(e) {
        this.taskManager.togglePrioritySymbol(this.activeTask, e.target.value);
        this.activeTask.priority = parseInt(e.target.value);
    }

    handleNotesInput(e) {
        e.target.addEventListener("blur", (e) => this.activeTask.notes = e.target.value, { once: true });
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
    }

    closeTaskPanel() {
        this.panelElement.style.display = "none";
    }

    changeInputBoxHeight(e) {
        if (!this.clone) {
            this.clone = this.cloneElement(e.target);
        }

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

    cloneElement(element) {
        const clone = element.cloneNode();
        clone.removeAttribute("id");
        clone.style.position = "fixed";
        clone.style.width = `${element.offsetWidth}px`;
        clone.style.visibility = "hidden";
        element.parentNode.appendChild(clone);
        
        return clone;
    }
}