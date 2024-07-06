export default class Task {
    constructor(title="New Task", notes="My task notes", dueDate=null, priority=0, status=false) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;

        // Validate due date
        if (dueDate !== null && !(dueDate instanceof Date)) {
            throw new TypeError("Due date must be a valid Date object or null");
        }
        this.dueDate = dueDate;

        // Validate priority
        if (![0, 1].includes(priority)) {
            throw new TypeError("Priority must be 0 (Low) or 1 (High)");
        }
        this.priority = priority;

        // Validate status
        if (typeof status !== "boolean") {
            throw new TypeError("Status must be a boolean");
        }
        this.status = status;
    }
}