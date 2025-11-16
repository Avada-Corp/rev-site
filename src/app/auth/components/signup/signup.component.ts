import { Observable } from 'rxjs';
import { isLoggedInSelector } from 'src/app/auth/store/selectors';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { BackendErrorsInterface } from '../../../shared/types/backendErrors.interface';
import {
  signupAction,
  signupFailureAction,
} from '../../store/actions/signup.action';
import { validationErrorsSelector } from '../../store/selectors';
import { SignupRequestInterface } from '../../types/SignupRequestInterface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public form: FormGroup;
  public isLoggedIn$: Observable<boolean | null>;
  public backendErrors$: Observable<BackendErrorsInterface | null>;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
    this.subscribe();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: [''],
      copyPassword: [''],
      tgAccount: [''],
    });
  }

  initializeValues(): void {
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
  }
  onSubmit() {
    if (this.form.value.password !== this.form.value.copyPassword) {
      this.store.dispatch(
        signupFailureAction({ errors: ['Password are not equal'] })
      );
    } else {
      this.route.queryParams.subscribe((params) => {
        const { refId = null } = params;
        this.store.dispatch(signupAction({ request: this.form.value, refId }));
      });
    }
  }

  subscribe() {
    this.isLoggedIn$.subscribe((isLogged) => {
      if (isLogged) {
        this.router.navigate(['/']);
      }
    });
  }
}
