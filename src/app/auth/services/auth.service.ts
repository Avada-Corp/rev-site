import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, take } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { environment } from 'src/environments/environment';
import { AuthResponseInterface } from 'src/app/auth/types/authResponse.interface';
import { LoginRequestInterface } from 'src/app/auth/types/loginRequest.interface';
import { ForgetPasswordInterface } from '../types/forgetPassword.interface';
import { ForgetPasswordResponseInterface } from '../types/forgetPasswordResponse.interface';
import { NewPasswordInterface } from './../types/newPassword.interface';
import { NewPasswordResponseInterface } from './../types/newPasswordResponse.interface';
import { SignupRequestInterface } from '../types/SignupRequestInterface';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { GetterResponseInterface } from 'src/app/shared/types/response.interface';
import { TgLoginResponseInterface } from '../types/tgLoginResponse.interface';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  getResponse(response: AuthResponseInterface): CurrentUserInterface {
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      email: response.email,
      tgAccount: response.tgAccount,
      userRole: response.userRole,
    };
  }

  getCurrentUserByToken(
    token: string
  ): Observable<CurrentUserTokenResponseInterface | null> {
    const url = `${environment.authUrl}/auth/user`;
    return this.http.post<CurrentUserTokenResponseInterface | null>(url, {
      token,
    });
    // TODO если прилетел нулл
    // TODO делать на бекенде это
  }

  signup(data: SignupRequestInterface): Observable<CurrentUserInterface> {
    const url = environment.authUrl + '/auth/registration';
    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map(this.getResponse));
  }

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = environment.authUrl + '/auth/login';
    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map(this.getResponse));
  }

  tgLogin(chatId: string): Observable<TgLoginResponseInterface> {
    const url = environment.authUrl + '/auth/tgLogin';
    return this.http.post<TgLoginResponseInterface>(url, { chatId });
  }

  tgAddEmail(email: string, password: string, chatId: string) {
    const url = environment.authUrl + '/auth/tgAddEmail';
    const data = {
      email,
      password,
      tgAccount: chatId,
    };
    return this.http.post<GetterResponseInterface<boolean>>(url, data);
  }

  newPassword(password: string, id: string): Observable<boolean> {
    const url = environment.authUrl + '/auth/newPassword';
    const data = { password, id };
    return this.http
      .post<NewPasswordResponseInterface>(url, data)
      .pipe(map((response) => (response.passwordReset ? true : false)));
  }

  forgetPassword(data: ForgetPasswordInterface): Observable<boolean> {
    const url = environment.authUrl + '/auth/reset';
    return this.http
      .post<ForgetPasswordResponseInterface>(url, data)
      .pipe(
        map((response: ForgetPasswordResponseInterface) =>
          response.emailSend ? true : false
        )
      );
  }
  logout(token: string) {
    const data = { token };
    const url = environment.authUrl + '/auth/logout';
    return this.http.post<NewPasswordResponseInterface>(url, data);
  }

  addReferral(email: string, refId: string | null) {
    const data = {
      email,
      refInfo: {
        id: refId || '2044268809',
        supportId: '327277912',
      },
    };
    const url = environment.authUrl + '/auth/addReferral';
    return this.http.post<boolean>(url, data);
  }
}
