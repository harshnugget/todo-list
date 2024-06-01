import { TaskManager } from './managers.js';

export default class Project {
    constructor(title) {
        this.title = title;
        this.taskManager = new TaskManager([]);
    }
}