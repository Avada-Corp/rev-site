import { PersistanceService } from 'src/app//shared/services/persistance.service';
import { ForgetPassComponent } from 'src/app/auth/components/forget-pass/forget-pass.component';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { NewPasswordComponent } from 'src/app/auth/components/new-password/new-password.component';
import { SignupComponent } from 'src/app/auth/components/signup/signup.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { reducers } from 'src/app/auth/store/reducers';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BackendErrorMessagesModule } from '../shared/modules/backendErrorMessages/backendErrorMessages.module';
import { ForgetPasswordEffect } from './store/effects/forgetPassword.effect';
import { LoginEffect } from './store/effects/login.effect';
import { LogoutEffect } from './store/effects/logout.effect';
import { NewPasswordEffect } from './store/effects/newPassword.effect';
import { SignupEffect } from './store/effects/signup.effect';
import { UserRoutingModule } from './auth-routing.module';
import { GetCurrentUserEffect } from './store/effects/getCurrentUser.effect';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgxTelegramWidgetModule } from 'ngx-telegram-widget';
import { TelegramLoginComponent } from './components/telegram-login/telegram-login.component';
import { TgLoginEffect } from './store/effects/tgLogin.effect';
import { AddReferralEffect } from './store/effects/addReferral.effect';
// import { AngularTelegramLoginWidgetModule } from 'angular-telegram-login-widget';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgetPassComponent,
    NewPasswordComponent,
    TelegramLoginComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    InputTextModule,
    ReactiveFormsModule,
    NgxTelegramWidgetModule,
    // AngularTelegramLoginWidgetModule,
    ButtonModule,
    ToastModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([
      ForgetPasswordEffect,
      LoginEffect,
      NewPasswordEffect,
      SignupEffect,
      LogoutEffect,
      GetCurrentUserEffect,
      TgLoginEffect,
      AddReferralEffect,
    ]),
    BackendErrorMessagesModule,
  ],

  providers: [AuthService, PersistanceService],
})
export class AuthModule {}
