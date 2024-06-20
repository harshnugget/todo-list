import "./style.css";
import Project from "./project.js";
import Task from "./task.js";
import ProjectManager from "./project_manager.js";
import DragAndDropper from "./drag_dropper.js";
import mainLogo from "./images/main_logo.svg";

document.querySelector("#main_logo").src = mainLogo;

window.app = (() => {

    const projectList = document.querySelector("#project-list");
    const taskList = document.querySelector("#task-list");
    const taskViewPanel = document.querySelector("#task-view-panel");
    const taskViewPanelElements = {
        title: taskViewPanel.querySelector("#task-title"),
        dueDate: taskViewPanel.querySelector("#task-due-date"),
        priority: taskViewPanel.querySelector("#task-priority"),
        notes: taskViewPanel.querySelector("#task-notes")
    };

    const projectManager = new ProjectManager(projectList, taskList);
    const taskManager = projectManager.taskManager;

    let projectDragger;
    let taskDragger;

    initializeEventListeners();
    projectManager.projectLoader();

    const createDragAndDropper = (function() {
        function shiftObject(objectList, fromIndex, toIndex) {
            if (fromIndex < 0 || fromIndex >= objectList.length || toIndex < 0 || toIndex >= objectList.length) {
                console.warn("shiftObject: Indices out of bounds");
                return objectList;
            }
            const [movedObject] = objectList.splice(fromIndex, 1);
            objectList.splice(toIndex, 0, movedObject);
            return objectList;
        }

        function draggerCallback(getObjectArray) {
            return function(fromIndex, toIndex) {
                const objectArray = getObjectArray();
                shiftObject(objectArray, fromIndex, toIndex);
            }
        }
    
        return function(elementList, objectList) {
            const dragger = new DragAndDropper(
                elementList, 
                draggerCallback(() => objectList)
            );
            return dragger;
        };
    })();

    function initializeEventListeners() {
        const addProjectButton = document.querySelector("#add-project-btn");
        const newTaskInput = document.querySelector("#new-task-input");
        const addTaskButton = document.querySelector("#add-task-btn");
        const taskView = document.querySelector("#task-view");
        const taskViewPanel = document.querySelector("#task-view-panel");

        addProjectButton.addEventListener("click", () => {
            createProject("Untitled Project");
        });

        addTaskButton.addEventListener("click", () => {
            if (newTaskInput.value) {
                createTask(newTaskInput.value);
                newTaskInput.value = "";
            }
        });

        taskView.addEventListener("click", (e) => {
            if (e.target === taskView) {
                taskManager.clearActiveTask();
                closeTaskPanel();
            }
        });

        taskViewPanel.addEventListener("click", (e) => {
            const activeTask = taskManager.activeTask;
            if (!activeTask) return;
            switch(e.target) {
                case taskViewPanelElements.dueDate:
                    e.target.addEventListener("blur", (e) => activeTask.dueDate = e.target.value, { once: true });
                    return;
                case taskViewPanelElements.priority:
                    activeTask.priority = e.target.checked === true ? 1 : 0;
                    return;
                case taskViewPanelElements.notes:
                    e.target.addEventListener("blur", (e) => activeTask.notes = e.target.value, { once: true });
                    return;
            }
        });
    }

    function createProject(title) {
        const project = new Project(title)
        const obj = projectManager.createProject(project);

        // Drag and drop stuff
        if (!projectDragger) {
            projectDragger = createDragAndDropper(projectList, projectManager.projects);
        }
        projectDragger.createEventListeners(obj.element);
    }

    function createTask(title) {
        const task = new Task(title);
        const obj = taskManager.createTask(task);

        // Drag and drop stuff
        if (!taskDragger) {
            taskDragger = createDragAndDropper(taskList, projectManager.activeProject.tasks);
        }
        taskDragger.createEventListeners(obj.element);

        // Task panel stuff
        closeTaskPanel();
        obj.element.addEventListener("click", () => {
            if (obj.task === taskManager.activeTask) {
                openTaskPanel(obj.task);
            } else {
                closeTaskPanel();
            }
        });
    }

    function openTaskPanel(task) {
        taskViewPanel.style.display = "block";
        taskViewPanelElements.title.innerHTML = task.title;
        taskViewPanelElements.dueDate.value = task.dueDate;
        taskViewPanelElements.priority.checked = task.priority === 1 ? true : false;
        taskViewPanelElements.notes.value = task.notes;

        // VVVV OPTIMIZE VVVV
        taskViewPanelElements.project = projectManager.activeProject;

        const node = projectList.parentNode.parentNode;
        node.addEventListener("click", (e) => {
            const activeProjectElement = projectManager.elementMap.get(taskViewPanelElements.project);
            if (e.target === node) {
                taskManager.clearActiveTask();
                closeTaskPanel();
                return;
            }
            if (e.target.closest(".project") !== activeProjectElement) {
                closeTaskPanel();
            }
        });
    }

    function closeTaskPanel() {
        taskViewPanel.style.display = "none";
    }

    return {
        projectManager,
        taskManager
    };
})();