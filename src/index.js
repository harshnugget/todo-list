import Project from './project.js';
import Task from './task.js';
import { ProjectManager } from './managers.js';
import UI  from './dom.js';
import mainLogo from './images/main_logo.svg';

document.querySelector("#main_logo").src = mainLogo;

window.app = (() => {
    const projectManager = new ProjectManager();
    const uiManager = new UI({ 
        createProject, 
        createTask,
        deleteProject ,
        deleteTask,
        taskLoader
    });

    initialize();

    function initialize() {
        projectLoader();
        createProject("Default Project");
        createTask("Example 1");
        createTask("Example 2");
    }

    function createProject(title) {
        const project = projectManager.createItem(new Project(title));
        uiManager.createProject(project);
        taskLoader(project.id);
    }

    function createTask(title) {
        const activeProject = projectManager.activeProject;
        if (!activeProject) {
            throw new ReferenceError("No active project found");
        }
        const task = activeProject.taskManager.createItem(new Task(title));
        uiManager.createTask(task);
    }

    function deleteProject(projectId) {
        const activeProjectIndex = getIndexById(projectManager.activeProject.id, projectManager.items);
        const projectIndex = getIndexById(projectId, projectManager.items);
        
        if (activeProjectIndex === projectIndex && projectManager.items.length > 1) {
            if (projectIndex === 0) {
                projectManager.activeProject = projectManager.items[activeProjectIndex + 1].id;
            } else {
                projectManager.activeProject = projectManager.items[activeProjectIndex - 1].id;
            }
        }

        projectManager.deleteItem(projectId);
        uiManager.deleteProject(projectId);
        
        if (projectManager.activeProject) {
            taskLoader(projectManager.activeProject.id);
        } else {
            uiManager.clearTaskList();
        }
    }

    function deleteTask(taskId) {
        projectManager.activeProject.taskManager.deleteItem(taskId);
        uiManager.deleteTask(taskId);
    }

    function taskLoader(projectId) {
        uiManager.clearTaskList();

        if (projectId != null) {
            const project = projectManager.items.find(project => project.id == projectId);
            const tasks = project.taskManager.items;
            if (tasks.length > 0) {
                tasks.forEach(task => uiManager.createTask(task));
            }

            projectManager.activeProject = projectId;
        } else {
            throw new TypeError(`projectId must be a number or a string. Result: ${projectId}`);
        }
    }

    function projectLoader() {
        uiManager.clearProjectList();

        const projects = projectManager.items;
        if (projects.length > 0) {
            projects.forEach(project => uiManager.createProject(project));

            if (projectManager.activeProject == null) {
                projectManager.activeProject = 0; 
            }
            
            taskLoader(projectManager.activeProject.id);
        }
    }

    function getIndexById(id, array=[]) {
        return array.findIndex(e => e.id == id);
    }

    return { createProject, createTask, deleteProject, deleteTask, uiManager, projectManager }
})();