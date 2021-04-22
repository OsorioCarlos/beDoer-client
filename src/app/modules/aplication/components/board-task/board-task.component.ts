import {Component, OnInit} from '@angular/core';
import {CategoryService} from 'src/app/services/category.service';
import {fillTask, CATEGORIES, Task, I_Task} from '../../../../mockup.db';


@Component({
  selector: 'app-board-task',
  templateUrl: './board-task.component.html',
  styleUrls: ['./board-task.component.css']
})
export class BoardTaskComponent implements OnInit {

  // -------------------------------------------------------------------------------
  // Atributos de la clase.
  // -------------------------------------------------------------------------------

  edit = true;
  tasks: I_Task[] = [];

  editableTask: I_Task = new Task();
  tasksToDo: I_Task[] = [];
  tasksDoing: I_Task[] = [];
  tasksDone: I_Task[] = [];

  taskTitle: string;
  taskDescription: string;
  taskDate: Date;

  categories: object = [];

  // -------------------------------------------------------------------------------
  // Métodos del componente.
  // -------------------------------------------------------------------------------
  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    // this.tasks = fillTask(100);
    this.getCategories();
    // this.getTasks();
  }

  getCategories(): void {
    this.categoryService.get().subscribe(categories => {
      this.categories = categories['data'];
    });
  }

  createTask(): void {
    console.log(this.taskTitle);
    console.log(this.taskDescription);
    console.log(this.taskDate);
    this.closeModal('create-task-modal');
  }

  openModal(name: string): void {
    const modal = document.getElementById(name);
    modal.style.display = 'block';
  }

  closeModal(name: string): void {
    const modal = document.getElementById(name);
    modal.style.display = 'none';
  }

  // -------------------------------------------------------------------------------
  // Métodos de lo modales.
  // -------------------------------------------------------------------------------


  // -------------------------------------------------------------------------------
  // Métodos CRUD de las tareas.
  // -------------------------------------------------------------------------------

  getTasks(): void {

    this.tasksToDo = [];
    this.tasksDoing = [];
    this.tasksDone = [];

    for (const task of this.tasks) {
      if (task.state === '1') {
        this.tasksToDo.push(task);
      } else if (task.state === '2') {
        this.tasksDoing.push(task);
      } else {
        this.tasksDone.push(task);
      }
    }

  }

  updateStateTask(task): void {
    console.log(task);
    if (task.state === '1') {
      task.state = '2';
      this.getTasks();
    } else if (task.state === '2') {
      task.state = '3';
      this.getTasks();
    } else {
      task.state = '1';
      this.getTasks();
    }

  }

  updateStateDelete(task): void {
    if (task.is_delete === false) {
      task.is_delete = true;
    }
  }

  // updateTask(task) {
  //   let editableTask: Task = new Task();

  //   editableTask.title = title;
  //   editableTask.description = description;
  //   editableTask.expiration_date = expiration_date;
  //   editableTask.state = '1';

  // }

}