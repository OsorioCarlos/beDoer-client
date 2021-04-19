import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  /****** delaracion de variables ******/
  public registerForm: FormGroup;
  private validateEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  // constructor
  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(40)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(this.validateEmail)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(7),
      ]]
    });
  }

  register(): void {
    console.log(this.registerForm.value);
    this.userService.register(this.registerForm.value);
    this.registerForm.reset();
    console.log(this.registerForm.value);
  }

  // getters de formGroup
  get name(): AbstractControl { return this.registerForm.get('name'); }

  get email(): AbstractControl { return this.registerForm.get('email'); }

  get password(): AbstractControl { return this.registerForm.get('password'); }

}