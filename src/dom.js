export default class UI {
    constructor({ createProject, createTask, deleteProject, deleteTask, taskLoader }) {
        this.projectList = document.querySelector("#project-list");
        this.taskList = document.querySelector("#task-list");;
        this.app = { 
            createProject,
            createTask,
            deleteProject,
            deleteTask,
            taskLoader
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelector("#add-project-btn").addEventListener("click", () => this.app.createProject("Untitled Project"));
        document.querySelector("#add-task-btn").addEventListener("click", () => {
            const taskInput = document.querySelector("#new-task-input")
            const taskTitle = taskInput.value;
            if (taskTitle) {
                this.app.createTask(taskTitle);
                taskInput.value = "";
            }
        });
    }

    createProject(project) {
        if (project.id == null) {
            throw new Error("Project is missing an id");
        }

        if (this.projectList.querySelector(`li[id="${project.id}"]`)) {
            throw new Error(`Project with id "${project.id}" already exists`);
        }

        // Create the project element
        let element = this.newElement ("li", {"class": "project", "id":`${project.id}`});
        const childElements = {
            "input": this.newElement("input", {"type": "text", "class": "project-name", "placeholder": "Project Name", "value": `${project.title}`, "readonly": true}), 
            "rename-btn": this.newElement("button", {"type": "button", "class": "rename-project-btn"}, "Rename"), 
            "remove-btn": this.newElement("button", {"type": "button", "class": "remove-project-btn"}, "Remove")}
    
        Object.values(childElements).forEach(value => element.appendChild(value));
        this.projectList.appendChild(element);

        // Event listeners
        element.addEventListener("click", (e) => {
            switch (e.target) {
                case childElements["rename-btn"]:
                    childElements["input"].removeAttribute("readonly");
                    childElements["input"].focus();
                    childElements["input"].addEventListener("blur", e => {
                        project.title = e.target.value;
                        e.target.setAttribute("readonly", true)
                    });
                    return;
                case childElements["remove-btn"]:
                    this.app.deleteProject(project.id);
                    return;
                default:
                    this.app.taskLoader(project.id);
            }
        });
    }

    createTask(task) {
        if (task.id == null) {
            throw new ReferenceError("Task id is not defined");
        }

        if (this.taskList.querySelector(`li[id="${task.id}"]`)) {
            throw new Error(`Task with id "${task.id}" already exists`);
        }
    
        // Create the task element
        const element = this.newElement("li", {"class": "task", "id": task.id})
        const childElements = {
            "input": this.newElement("input", {"type": "checkbox"}),
            "span": this.newElement("span", {}, task.title),
            "remove-btn": this.newElement("button", {}, "Remove")};
        
        childElements["input"].checked = task.status === true;

        Object.values(childElements).forEach(value => element.appendChild(value));
        this.taskList.appendChild(element);

        // Event listeners
        element.addEventListener("click", (e) => {
            switch (e.target) {
                case childElements["input"]:
                    task.status = e.target.checked;
                    return;
                case childElements["remove-btn"]:
                    this.app.deleteTask(task.id);
                    return;
            }
        });
    }

    deleteProject(id) {
        const element = this.projectList.querySelector(`li[id="${id}"]`);
        this.projectList.removeChild(element);
    }
    
    deleteTask(id) {
        const element = this.taskList.querySelector(`li[id="${id}"]`);
        this.taskList.removeChild(element);
    }

    clearProjectList() {
        this.clearTaskList();
        this.projectList.innerHTML = "";
    }

    clearTaskList() {
        this.taskList.innerHTML = "";
    }

    newElement(tag, attributes={}, innerHTML="") {
        const element = document.createElement(tag);

        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }

        element.innerHTML = innerHTML;
        return element;
    }
}