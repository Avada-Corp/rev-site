import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgetPassComponent } from './components/forget-pass/forget-pass.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { TelegramLoginComponent } from './components/telegram-login/telegram-login.component';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forget', component: ForgetPassComponent },
      { path: 'tgLogin', component: TelegramLoginComponent },
      { path: 'newpassword/:id', component: NewPasswordComponent },
      { path: '**', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
