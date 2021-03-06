import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CategoryService} from '../../../../services/category.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AplicationService} from '../../../../services/aplication/aplication.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-board-task-team',
  templateUrl: './board-task-team.component.html',
  styleUrls: ['./board-task-team.component.css']
})
export class BoardTaskTeamComponent implements OnInit {

  // -------------------------------------------------------------------------------
  // Atributos de la clase.
  // -------------------------------------------------------------------------------
  public teamId;
  public dataTasks = [];
  public totalStates;
  public createTasksForm: FormGroup;
  public editTaskForm: FormGroup;
  private idTask;
  private stateTask;
  private currentState: number;
  taskDate: Date;
  categories: object = [];

  // -------------------------------------------------------------------------------
  // Contructor e iniciador.
  // -------------------------------------------------------------------------------

  constructor(
    private categoryService: CategoryService,
    private appService: AplicationService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.teamId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.createTasksForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40)
      ]],
      description: [''],
      expiration_date: [''],
      state_id: ['', [
        Validators.required
      ]],
      team_id: [`${this.teamId}`]
    });

    this.editTaskForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40)
      ]],
      description: [''],
      expiration_date: [''],
      state_id: [''],
      team_id: ['', [
        Validators.required,
      ]]
    });

    // this.getCategories();
    this.getTasks(1);
  }

  // -------------------------------------------------------------------------------
  // Métodos del componente.
  // -------------------------------------------------------------------------------
  // getCategories(): void {
  //   this.categoryService.get().subscribe(res => {
  //     this.categories = res['data'];
  //   });
  // }

  // -------------------------------------------------------------------------------
  // Getter de registerForm.
  // -------------------------------------------------------------------------------
  get registerState_id(): AbstractControl {
    return this.createTasksForm.get('state_id');
  }

  get editState_id(): AbstractControl {
    return this.editTaskForm.get('state_id');
  }

  // -------------------------------------------------------------------------------
  // metodos de modal.
  // -------------------------------------------------------------------------------
  openModal(name: string, data?): void {
    const modal = document.getElementById(name);
    modal.style.display = 'block';

    if (data) {
      this.idTask = data.id;
      this.stateTask = data.state_id;

      this.editTaskForm.patchValue({
        title: data.title,
        description: data.description,
        expiration_date: data.expiration_date,
        state_id: data.state_id,
        team_id: this.teamId
      });
    }
  }

  closeModal(name: string): void {
    const modal = document.getElementById(name);
    modal.style.display = 'none';
  }

  // -------------------------------------------------------------------------------
  // CRUD del modal.
  // -------------------------------------------------------------------------------
  getTasks(state: number): void {
    this.spinner.show();
    this.stateSelected(state);
    this.appService.get(`team-tasks/${this.teamId}/${state}`).subscribe(
      res => {
        this.dataTasks = res.data;
        this.totalStates = res.totalStates;
        this.spinner.hide();
        if (this.dataTasks.length === (0 || null)) {
          this.toastrService.info('Has click en <strong>&quot;crear&quot;</strong> para crear una tarea', 'Sin tareas.', {
            progressBar: true,
            closeButton: true,
            enableHtml: true,
            timeOut: 4000
          });
        }
      },
      () => {
        this.spinner.hide();
        this.router.navigate(['app/not-found']);
      }
    );
  }

  createTasks(): void {
    console.log(this.createTasksForm.value);
    console.log(this.teamId);
    if (this.createTasksForm.value) {
      this.appService.post('team-tasks', {
        title: this.createTasksForm.value.title,
        description: this.createTasksForm.value.description,
        expiration_date: this.createTasksForm.value.expiration_date,
        state_id: this.createTasksForm.value.state_id,
        team_id: this.teamId
      }).subscribe(
        res => {
          this.toastrService.success('', 'Tarea creada.', {
            timeOut: 2000,
            progressBar: true
          });
        },
        error => {
          console.log(error);
          this.toastrService.error('error', 'Error con el servidor.', {
            timeOut: 2000,
            progressBar: true
          });
        }
      );
    } else {
      this.toastrService.info('Rellene el formulario formularios', 'Sin datos.', {
        timeOut: 2000,
        progressBar: true
      });
    }

    this.getTasks(this.createTasksForm.value.state_id);
    this.createTasksForm.reset();
    this.closeModal('create-task-modal');
  }

  editTask(): void {
    this.appService.put(`tasks/${this.idTask}`, {
      title: this.editTaskForm.value.title,
      description: this.editTaskForm.value.description,
      expiration_date: this.editTaskForm.value.expiration_date,
      state_id: this.editTaskForm.value.state_id,
      team_id: this.teamId,
    }).subscribe(
      res => {
        this.toastrService.success('', 'Tarea editada.', {
          timeOut: 2000,
          progressBar: true
        });
      },
      error => {
        console.log(error);
        this.toastrService.error('Error con el servidor.', 'error', {
          timeOut: 2000,
          progressBar: true
        });
      }
    );
    this.getTasks(this.editTaskForm.value.state_id);
    this.closeModal('edit-task-modal');
  }

  deleteTask(): void {
    this.appService.delete(`tasks/${this.idTask}`).subscribe(
      res => {
        console.log('entre a lo bueno');
        this.toastrService.success('', 'Tarea eliminada.', {
          timeOut: 2000,
          progressBar: true
        });
      },
      error => {
        console.log('entre a lo malo');
        console.log(error);
        this.toastrService.error('Error con el servidor.', 'error al borrar', {
          timeOut: 2000,
          progressBar: true
        });
      }
    );
    this.closeModal('edit-task-modal');
    this.closeModal('deleted-task-modal');
    this.idTask = undefined;
    this.getTasks(this.stateTask);
  }

  changeState(data, state): void {
    this.appService.put('team-tasks/change-states', {
      id: data.id,
      state_id: state
    }).subscribe(
      res => {
        console.log('entre a lo bueno');
        this.toastrService.success('', 'Estado editado.', {
          timeOut: 2000,
          progressBar: true
        });
      },
      error => {
        console.log('entre a lo malo');
        console.log(error);
        this.toastrService.error('Error con el servidor.', 'error al editar estado', {
          timeOut: 2000,
          progressBar: true
        });
      }
    );
    this.getTasks(state);
  }

  stateSelected(state: number) {
    if (this.currentState == undefined) document.querySelector('.states a:nth-child(1)').removeAttribute('id');
    else document.querySelector(`.states a:nth-child(${this.currentState})`).removeAttribute('id');

    this.currentState = state;
    document.querySelector(`.states a:nth-child(${this.currentState})`).setAttribute('id', 'state-selected');
  }
}
