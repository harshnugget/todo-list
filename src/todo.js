// Behind the scenes logic should go here
// Everything here should be controllable through the browser console

// Create a class that deals with managing Tasks and Projects
// Functionality includes creating or deleting new tasks/projects, and assigning IDs
class Manager {
    constructor(array=[]) {
        this.items = [];
        array.forEach(item => this.createItem(item));
    }

    createItem(item) {
        item.id = (this.items).length > 0 ? this.items[(this.items).length - 1].id + 1 : 0;  // Assign a unique id to each item before pushing to the array
        this.items.push(item);
        return item;
    }

    deleteItem(itemId) {
        const index = (this.items).findIndex(item => itemId == item.id); // Retrieve the index of where item id is found
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}

class Task {
    constructor(title, description, dueDate, priority="Low", status=false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority.toLowerCase();
        this.status = status;
        
        if (!["low", "high"].includes(this.priority)) {
            throw new Error("Priority must be either 'Low' or 'High'");
        }

        if (typeof this.status !== "boolean") {
            throw new Error("Status must be a boolean");
        }
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.taskManager = new Manager([]);
    }
}

class ProjectManager extends Manager {
    constructor(project) {
        super(project);
        this._activeProjectId = null
    }

    set activeProject(id) {
        if (typeof id === "number" || typeof id === "string") {
            this._activeProjectId = id;
        } else {
            throw new TypeError("Setting the active project requires the 'id' value to be either a number or a string.");
        }
    }

    get activeProject() {
        return this.items.find(project => project.id === this._activeProjectId) || null;
    }

    createItem(project) {
        project = super.createItem(project);
        this._activeProjectId = project.id;
        return project;
    }
}

export { Manager, Task, Project, ProjectManager };