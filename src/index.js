import "./style.css";
import Project from "./project.js";
import Task from "./task.js";
import { TaskPanel } from "./task_manager.js";
import ProjectManager from "./project_manager.js";
import DragAndDropper from "./drag_dropper.js";
import mainLogo from "./images/main_logo.svg";

document.querySelector("#main_logo").src = mainLogo;

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
    }

    function createProject(title) {
        const project = new Project(title)
        const obj = projectManager.createProject(project);

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
        obj.element.addEventListener("click", () => {
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
