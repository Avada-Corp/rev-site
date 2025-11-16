import { Observable } from 'rxjs';
import { isLoggedInSelector } from 'src/app/auth/store/selectors';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { forgetPasswordAction } from '../../store/actions/forgetPassword.action';
import { validationErrorsSelector } from '../../store/selectors';
import { ForgetPasswordInterface } from '../../types/forgetPassword.interface';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],
})
export class ForgetPassComponent implements OnInit {
  public form: FormGroup;
  public isLoggedIn$: Observable<boolean | null>;
  public backendErrors$: Observable<BackendErrorsInterface | null>;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
    this.subscribe();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  initializeValues(): void {
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
  }

  onSubmit(): void {
    const request: ForgetPasswordInterface = this.form.value;
    this.store.dispatch(forgetPasswordAction({ request }));
    this.form.reset();
  }

  subscribe() {
    this.isLoggedIn$.subscribe((isLogged) => {
      if (isLogged) {
        this.router.navigate(['/']);
      }
    });
  }
  // forgetPassword() {
  //   this.http.post(`${environment.authUrl}/reset`, this.form.value).subscribe(
  //     (res) => {
  //       this.form.reset();
  //       this.router.navigate(['login']);
  //     },
  //     (error) => console.error(error)
  //   );
  // }
}
