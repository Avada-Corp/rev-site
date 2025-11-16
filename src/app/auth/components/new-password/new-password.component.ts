import { Observable } from 'rxjs';
import { isLoggedInSelector } from 'src/app/auth/store/selectors';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { BackendErrorsInterface } from '../../../shared/types/backendErrors.interface';
import { newPasswordAction } from '../../store/actions/newPassword.action';
import { validationErrorsSelector } from '../../store/selectors';
import { NewPasswordInterface } from '../../types/newPassword.interface';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  public form: FormGroup;
  public isLoggedIn$: Observable<boolean | null>;
  public backendErrors$: Observable<BackendErrorsInterface | null>;
  public id: string;

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
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required]],
      copyPassword: ['', [Validators.required]],
    });
  }

  initializeValues(): void {
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
  }

  onSubmit() {
    const { password, copyPassword } = this.form.value;
    if (password === copyPassword) {
      this.store.dispatch(newPasswordAction({ password, id: this.id }));
      this.form.reset();
    } else {
      alert('Пароли не одинаковые');
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
