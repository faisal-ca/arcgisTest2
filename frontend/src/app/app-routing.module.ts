import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import {AuthService} from './services/authService'
import {HomeAuthService} from './services/homeAuth';
import { SignupComponent } from './signup/signup.component';
import { WindowComponent } from './window/window.component';

const routes: Routes = [
  {path:'login',component:LoginComponent, canActivate: [AuthService]},
  {path:'signup',component:SignupComponent, canActivate: [AuthService]},
  {path:'profile',component:WindowComponent, canActivate: [HomeAuthService]},
  {path:'home',component:HomeComponent, canActivate: [HomeAuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
