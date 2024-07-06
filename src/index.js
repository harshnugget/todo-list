import "./style.css";
import Project from "./project.js";
import Task from "./task.js";
import TaskPanel from "./taskPanel.js";
import ProjectManager from "./projectManager.js";
import DragAndDropper from "./drag_dropper.js";
import { mainLogo } from "./images/svg.js";
import { UITools } from "./Manager.js";

document.querySelector("#main-logo").innerHTML = mainLogo;

const app = (() => {

    const projectList = document.querySelector("#project-list");
    const taskList = document.querySelector("#task-list");

    const projectManager = new ProjectManager(projectList, taskList);
    const taskManager = projectManager.taskManager;
    const taskPanel = new TaskPanel(taskManager);

    const projectDragger = new DragAndDropper(
        projectList, 
        () => projectManager.projects
    );
    
    const taskDragger = new DragAndDropper(
        taskList, 
        () => projectManager.activeProject.tasks
    );

    function showDialogElement() {
        const parentElement = UITools.newElement("dialog", {"class": "remove-item-dialog"});
        const childElements = {
            "p1": UITools.newElement("p", {}, `Are you sure you want to reset?`),
            "p2": UITools.newElement("p", {}, `All your projects and tasks will be deleted.`),
            "yes-btn": UITools.newElement("button", {"type": "button"}, "Yes"),
            "no-btn": UITools.newElement("button", {"type": "button"}, "No"),
        };
        Object.values(childElements).forEach(element => {
            parentElement.appendChild(element);
        });

        document.querySelector("body").appendChild(parentElement);

        // Event listeners
        childElements["yes-btn"].addEventListener("click", (e) => {
            parentElement.remove()
            localStorage.clear();
            location.reload();
        });

        childElements["no-btn"].addEventListener("click", (e) => {
            parentElement.remove()
        });

        // Display the dialog
        parentElement.showModal();
    }

    function initializeEventListeners() {
        const resetAllButton = document.querySelector("#reset-all-btn");
        const addProjectButton = document.querySelector("#add-project-btn");
        const newTaskInput = document.querySelector("#new-task-input");
        const addTaskButton = document.querySelector("#add-task-btn");
        const filterTaskDropDown = document.querySelector("#task-filter");

        resetAllButton.addEventListener("click", () => {
            showDialogElement();
        });

        addProjectButton.addEventListener("click", () => {
            createProject("");
        });

        newTaskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTaskButton.click();
            }
        })

        addTaskButton.addEventListener("click", () => {
            if (newTaskInput.value) {
                createTask(newTaskInput.value);
                newTaskInput.value = "";
            }
        });

        filterTaskDropDown.addEventListener("change", (e) => {
            taskManager.filterTasks(e.target.value);
        });
    }

    initializeEventListeners();

    function createProject(title, project=null) {
        if (!project) {
           project = new Project(title);
        }
        
        const obj = projectManager.createProject(project);

        // Drag and drop stuff
        projectDragger.createEventListeners(obj.element);

        // Task panel stuff
        taskPanel.closeTaskPanel();

        // Select project for renaming
        if (!title) {
            const inputElement = obj.element.querySelector("input");
            projectManager.renameProject(obj.project, inputElement);
        }
    }

    function createTask(title, task=null) {
        if (!projectManager.activeProject) {
            alert("Cannot add task to a non-existing project");
            return;
        }

        if (!task) {
            task = new Task(title);
        }
        
        const obj = taskManager.createTask(task);

        // Drag and drop stuff
        taskDragger.createEventListeners(obj.element);

        // Task panel stuff
        taskPanel.closeTaskPanel();
        
        obj.element.addEventListener("click", (e) => {
            if (obj.task === taskManager.activeTask) {
                taskPanel.openTaskPanel(obj.task);
            } else {
                taskPanel.closeTaskPanel();
            }
        });
    }

    function parseLocalStorage() {
        const obj = JSON.parse(localStorage.getItem("projects"));

        // Rebuild projects and tasks
        obj.forEach(project => {
            const tasks = project.tasks;

            Object.setPrototypeOf(project, Project.prototype);
            project.tasks = []; // Remove tasks from this project before rebuilding them
            createProject("", project);

            tasks.forEach(task => {
                Object.setPrototypeOf(task, Task.prototype);
                createTask("", task);
            });
        });

        projectList.querySelectorAll(".project-name-input").forEach(input => input.setAttribute("readonly", true));
    }

    // Create default projects/tasks if no localStorage
    if (localStorage.length === 0) {
        createProject("Default");
        createTask("Task 1");
        createTask("Task 2");
    } else {
        parseLocalStorage();
    }

    // Load projects into DOM
    projectManager.projectLoader();

    return {
        projectManager,
        taskManager,
        createProject,
        createTask
    };
});

window.addEventListener('load', () => {
    window.app = app();
});
