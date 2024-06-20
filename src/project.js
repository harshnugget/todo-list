export default class Project {
    constructor(title="New Project") {
        this.title = title;
        this.tasks = []
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(task) {
        const indexOfTask = this.tasks.findIndex(t => t === task);
        this.tasks.splice(indexOfTask, 1);
    }
}