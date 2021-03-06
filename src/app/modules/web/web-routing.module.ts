import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }
  // {
  //   path: '',
  //   children: [
  //     { path: 'bienvenido', component: HomeComponent},
  //     { path: 'login', component: LoginComponent},
  //     { path: '**', redirectTo: 'bienvenido'},
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
