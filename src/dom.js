export default class UIManager {
    constructor({ createProject, createTask, deleteProject, deleteTask, taskLoader }) {
        this.projectList = document.querySelector("#project-list");
        this.taskList = document.querySelector("#task-list");
        this.taskViewPanel = document.querySelector("#task-view-panel");
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

        if (this.projectList.querySelector(`li[dataset-id="${project.id}"]`)) {
            throw new Error(`Project with id "${project.id}" already exists`);
        }

        // Create the project element
        let element = this.newElement ("li", {"class": "project", "dataset-id":`${project.id}`});
        const childElements = {
            "input": this.newElement("input", {"type": "text", "class": "project-name", "placeholder": "Project Name", "value": `${project.title}`, "readonly": true}), 
            "rename-btn": this.newElement("button", {"type": "button", "class": "rename-project-btn"}, "Rename"), 
            "remove-btn": this.newElement("button", {"type": "button", "class": "remove-project-btn"}, "Remove")}
    
        Object.values(childElements).forEach(value => element.appendChild(value));
        this.projectList.appendChild(element);

        renameProject();
        setActiveProject();

        function renameProject() {
            childElements["input"].removeAttribute("readonly");
            childElements["input"].focus();
            childElements["input"].select();
            childElements["input"].addEventListener("blur", e => {
                project.title = e.target.value;
                e.target.setAttribute("readonly", true)
            });          
        }

        function setActiveProject() {
            document.querySelectorAll(".project.active").forEach(e => e.classList.remove("active"));
            element.classList.add("active");
        }

        // Event listeners
        element.addEventListener("click", (e) => {
            switch (e.target) {
                case childElements["rename-btn"]:
                    renameProject();
                    return;
                case childElements["remove-btn"]:
                    this.app.deleteProject(project.id);
                    return;
                default:
                    this.app.taskLoader(project.id);
                    setActiveProject();
            }
        });
    }

    createTask(task) {
        if (task.id == null) {
            throw new ReferenceError("Task id is not defined");
        }

        if (this.taskList.querySelector(`li[dataset-id="${task.id}"]`)) {
            throw new Error(`Task with id "${task.id}" already exists`);
        }
    
        // Create the task element
        const element = this.newElement("li", {"class": "task", "dataset-id": task.id})
        const childElements = {
            "input": this.newElement("input", {"type": "checkbox"}),
            "span": this.newElement("span", {}, task.title),
            "remove-btn": this.newElement("button", {}, "Remove")
        };
        
        childElements["input"].checked = task.status === true;

        Object.values(childElements).forEach(value => element.appendChild(value));
        this.taskList.appendChild(element);

        document.querySelectorAll(".task.active").forEach(e => e.classList.remove("active"));

        // VVVVVV FIX VVVVVVV
        this.taskViewPanel.querySelector("#switch").addEventListener("click", e => {
            if (e.target.checked === true) {
                task.priority = "high";
            } else {
                task.priority = "low";
            }
        });

        // VVVVV OPTIMIZE THIS VVVVV
        const setActiveTask = (taskElement, taskObject) => {
            if (taskElement.classList.contains("active")) {
                taskElement.classList.remove("active");
                this.taskViewPanel.classList.remove('visible');
            } else {
                document.querySelectorAll(".task.active").forEach(e => e.classList.remove("active"));
                taskElement.classList.add("active");
                this.taskViewPanel.querySelector("h1").innerHTML = taskObject.title;
                this.taskViewPanel.querySelector("#due-date").value = taskObject.dueDate;
                if (taskObject.priority == "low") {
                    this.taskViewPanel.querySelector("#switch").checked = false;
                } else if (taskObject.priority == "high") {
                    this.taskViewPanel.querySelector("#switch").checked = true;
                }
                
                this.taskViewPanel.classList.add('visible');
            }
        }

        // Event listeners
        element.addEventListener("click", (e) => {
            switch (e.target) {
                case childElements["input"]:
                    task.status = e.target.checked;
                    return;
                case childElements["remove-btn"]:
                    this.app.deleteTask(task.id);
                    return;
                default:
                    setActiveTask(e.target, task);
            }
        });
    }

    deleteProject(id) {
        const element = this.projectList.querySelector(`li[dataset-id="${id}"]`);
        this.projectList.removeChild(element);
    }
    
    deleteTask(id) {
        const element = this.taskList.querySelector(`li[dataset-id="${id}"]`);
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