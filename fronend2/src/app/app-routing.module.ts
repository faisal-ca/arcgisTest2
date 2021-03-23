import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {AuthService} from './services/authService'
import {HomeAuthService} from './services/homeAuth';

const routes: Routes = [
  {path:'login',component:LoginComponent, canActivate: [AuthService]},
  {path:'home',component:HomeComponent, canActivate: [HomeAuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
