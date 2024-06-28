import "./style.css";
import Project from "./project.js";
import Task from "./task.js";
import TaskPanel from "./task_panel.js";
import ProjectManager from "./project_manager.js";
import DragAndDropper from "./drag_dropper.js";
import { mainLogo } from "./images/svg.js";

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

    initializeEventListeners();
    projectManager.projectLoader();

    function initializeEventListeners() {
        const addProjectButton = document.querySelector("#add-project-btn");
        const newTaskInput = document.querySelector("#new-task-input");
        const addTaskButton = document.querySelector("#add-task-btn");
        const filterTask = document.querySelector("#task-filter");

        addProjectButton.addEventListener("click", () => {
            createProject("Untitled Project");
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

        filterTask.addEventListener("change", (e) => {
            switch (e.target.value) {
                case "0":
                    taskManager.taskLoader(0);
                    return;
                case "1":
                    taskManager.taskLoader(1);
                    return;
                case "2":
                    taskManager.taskLoader(2);
                    return;
            }
        });
    }

    function createProject(title) {
        const project = new Project(title)
        const obj = projectManager.createProject(project);

        // Select input of newly created projects for renaming
        if (projectManager.projects.length > 1) {
            const inputElement = obj.element.querySelector(".project-name-input");
            projectManager.renameProject(project, inputElement);
        }

        // Drag and drop stuff
        projectDragger.createEventListeners(obj.element);

        // Task panel stuff
        taskPanel.closeTaskPanel();
    }

    function createTask(title) {
        const task = new Task(title);
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

    return {
        projectManager,
        taskManager,
        createProject,
        createTask
    };
})();

window.app = app;
window.app.createProject("Default");
window.app.createTask("Task 1");
window.app.createTask("Task 2");
