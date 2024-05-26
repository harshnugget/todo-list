// Behind the scenes logic should go here
// Everything here should be controllable through the browser console

// Create a class that deals with managing Tasks and Projects
// Functionality includes creating or deleting new tasks/projects, and assigning IDs
class Manager {
    constructor(array = []) {
        this.items = [];
        array.forEach(item => this.createItem(item));
    }

    createItem(item) {
        item.id = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 0;  // Assign a unique id to each item before pushing to the array
        this.items.push(item);
    }

    deleteItem(itemId) {
        const index = this[this.items].findIndex(item => itemId === item.id); // Retrieve the index of where item id is found
        if (index !== -1) this[this.items].splice(index, 1);
    }
}

// Constructing a task
class Task {
    constructor(title, description, dueDate, priority="Low", status=false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }
}

// Constructing a project
class Project {
    constructor(title) {
        this.title = title;
        this.taskManager = new Manager();
    }
}

export { Manager, Task, Project };