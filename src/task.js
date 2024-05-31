export default class Task {
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