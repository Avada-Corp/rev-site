import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SignupRequestInterface } from 'src/app/auth/types/SignupRequestInterface';
import {
  tgAddEmailAction,
  tgAddEmailFailureAction,
} from '../store/actions/tgAddEmail.action';
import { MessageService } from 'primeng/api';
import { PersistanceService } from 'src/app/shared/services/persistance.service';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss'],
})
export class AddEmailComponent {
  @Input('email') email: string;
  public form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private messageService: MessageService,
    private persService: PersistanceService
  ) {}

  ngOnInit(): void {
    this.persService.set('isAddEmail', true);
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    const request: SignupRequestInterface = this.form.value;
    const chatId = this.email.split('@')[0] || null;
    if (chatId != null) {
      this.store.dispatch(
        tgAddEmailAction({
          email: request.email,
          password: request.password,
          chatId,
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        life: 10000,
        detail: 'Some problems with get your chat id',
      });
    }
  }
}
