import { UITools, Manager } from "./manager.js"
import TaskManager from "./task_manager.js";

export default class ProjectManager extends Manager {
    constructor(projectList, taskList) {
        super(projectList);
        this.taskManager = new TaskManager(() => this.activeProject, taskList);
        this.projects = [];
    }

    get activeProject() {
        return super.activeObject;
    }

    set activeProject(project) {
        super.activeObject = project;
        this.taskManager.taskLoader();
    }

    clearActiveProject() {
        super.clearActiveObject();
        this.taskManager.taskLoader();
    }

    createProject(project) {
        const obj = super.createObject(project);
        this.projects.push(project);
        this.activeProject = project;
        this.createEventListeners(project, obj.element);
        
        return { project, element: obj.element }
    }

    removeProject(project) {
        const activeProject = this.activeProject;
        super.removeObject(project);

        const index = this.projects.findIndex(p => p === project);
        this.projects.splice(index, 1);

         // Re-assign active project if the deleted project was active
         if (activeProject === project) {
            if (this.projects.length === 0) {
                this.clearActiveProject();
            } else if (index === this.projects.length) {
                this.activeProject = this.projects[index-1];
            } else {
                this.activeProject = this.projects[index];
            }
            return;
        }
    }

    renameProject(project, inputElement) {
        inputElement.removeAttribute("readonly");
        inputElement.focus();
        inputElement.select();
        inputElement.addEventListener("blur", updateValue);
        inputElement.addEventListener("keydown", (e) => {
            if (e.keyCode === 13) {
                updateValue();
            }
          });

        function updateValue() {
            project.title = inputElement.value;
            inputElement.setAttribute("readonly", true);
            inputElement.removeEventListener("blur", updateValue);
        }
    }

    createElement(project) {
        const parentElement = super.createElement(project);
        const childElements = {
            "input": UITools.newElement("input", {"type": "text", "class": "project-name-input", "placeholder": "Project Name", "value": `${project.title || "Untitled Project"}`, "readonly": true}), 
            "rename-btn": UITools.newElement("button", {"type": "button", "class": "rename-project-btn"}, "Rename"), 
            "remove-btn": UITools.newElement("button", {"type": "button", "class": "remove-project-btn"}, "Remove")
        };

        Object.values(childElements).forEach(element => {
            parentElement.appendChild(element);
        });

        return parentElement;
    }

    createEventListeners(project, element) {
        const input = element.querySelector(".project-name-input")
        const renameButton = element.querySelector(".rename-project-btn");
        const removeButton = element.querySelector(".remove-project-btn");

        element.addEventListener("click", (e) => {
            switch(e.target) {
                case renameButton:
                    this.renameProject(project, input);
                    return;
                case removeButton:
                    this.showDialogElement(project);
                    return;
                default:
                    if (project !== this.activeProject) {
                        this.activeProject = project;
                    } 
            }
        });
    }

    showDialogElement(project) {
        const parentElement = UITools.newElement("dialog", {"class": "remove-item-dialog"});
        const childElements = {
            "title": UITools.newElement("h2", {}, `${project.title}`),
            "p": UITools.newElement("p", {}, `Are you sure you want to remove this project?`),
            "yes-btn": UITools.newElement("button", {"type": "button"}, "Yes"),
            "no-btn": UITools.newElement("button", {"type": "button"}, "No"),
        };
        Object.values(childElements).forEach(element => {
            parentElement.appendChild(element);
        });

        this.container.appendChild(parentElement);

        // Event listeners
        childElements["yes-btn"].addEventListener("click", (e) => {
            parentElement.remove()
            this.removeProject(project)
        });

        childElements["no-btn"].addEventListener("click", (e) => {
            parentElement.remove()
        });

        // Display the dialog
        parentElement.showModal();
    }

    projectLoader() {
        super.objectLoader(this.projects);
        this.activeProject = this.projects[0];
    }
}