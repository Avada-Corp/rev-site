import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { LoginRequestInterface } from './../../types/loginRequest.interface';
import { loginAction } from './../../store/actions/login.action';
import { isLoggedInSelector } from 'src/app/auth/store/selectors';
import { validationErrorsSelector } from './../../store/selectors';
import { RefIdService } from '../../services/ref-id.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public isLoggedIn$: Observable<boolean | null>;
  public backendErrors$: Observable<BackendErrorsInterface | null>;
  public refId: string | null = null;

  // botName = 'copy_register_bot';
  botName = environment.authBot;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private refService: RefIdService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
    this.subscribe();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  initializeValues(): void {
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
  }

  subscribe() {
    this.isLoggedIn$.subscribe((isLogged) => {
      if (isLogged) {
        this.router.navigate(['/']);
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.refId = this.refService.getRefId(params);
    });
  }

  onSubmit() {
    const request: LoginRequestInterface = this.form.value;
    this.store.dispatch(loginAction({ request }));
  }

  getTgRefLink() {
    return this.refId ? `auth/tgLogin?refId=${this.refId}` : 'auth/tgLogin';
  }

  onLoad(a: any) {
    console.info('onLoad: ', a);
  }
  onLoadError(a: any) {
    console.info('onLoadError: ', a);
  }
  onLogin(a: any) {
    console.info('onLogin: ', a);
  }
}
