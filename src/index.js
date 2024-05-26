import { Manager, Task, Project } from './todo.js';
import './dom.js';

// Create projects and tasks
window.project1 = new Project("Project 1");
window.project2 = new Project("Project 2");

const task1 = new Task("Task 1", "Description 1", new Date(), "High");
const task2 = new Task("Task 2", "Description 2", new Date(), "Low");
const task3 = new Task("Task 3", "Description 2", new Date(), "High");
const task4 = new Task("Task 4", "Description 2", new Date(), "Low");

project1.taskManager.createItem(task1);
project1.taskManager.createItem(task2);
project1.taskManager.createItem(task3);
project1.taskManager.createItem(task4);

const task5 = new Task("Task 5", "Description 1", new Date(), "Low");
const task6 = new Task("Task 6", "Description 2", new Date(), "Low");
const task7 = new Task("Task 7", "Description 2", new Date(), "High");
const task8 = new Task("Task 8", "Description 2", new Date(), "High");

project2.taskManager.createItem(task5);
project2.taskManager.createItem(task6);
project2.taskManager.createItem(task7);
project2.taskManager.createItem(task8);

window.projectManager = new Manager([project1, project2]);