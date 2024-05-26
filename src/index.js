import { Manager, Task, Project } from './todo.js';
import './dom.js';

// Create projects and tasks
window.project1 = new Project("Project 1");
window.project2 = new Project("Project 2");

const task1 = new Task("Task 1", "Description 1", new Date(), "High");
const task2 = new Task("Task 2", "Description 2", new Date(), "Low");

project1.taskManager.createItem(task1);
project2.taskManager.createItem(task2);

window.projectManager = new Manager([project1, project2]);