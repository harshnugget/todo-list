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

class ProjectManager extends Manager {
    constructor(projects=[]) {
        super(projects);
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

class TaskManager extends Manager {
    constructor(tasks=[]) {
        super(tasks);
    }
}

export { ProjectManager, TaskManager }