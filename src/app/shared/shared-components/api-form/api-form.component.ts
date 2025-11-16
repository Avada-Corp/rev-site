import {
  Component,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { validationErrorsSelector } from 'src/app/auth/store/selectors';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { createApiAction } from '../../../page/store/actions/createApi.action';
import { MessageService } from 'primeng/api';
import { markets } from 'src/app/shared/rConst';
import {
  CurrentUserApi,
  EditApi,
} from '../../../page/types/userInfo.interface';
import { editApiAction } from '../../../page/store/actions/editApi.action';
import { addExistingApiAction } from '../store/actions/addExistingApi.action';
import { isShowPassphrase } from '../../helpers/helpers';

@Component({
  selector: 'app-api-form',
  templateUrl: './api-form.component.html',
  styleUrls: ['./api-form.component.scss'],
})
export class ApiFormComponent implements OnInit, OnChanges {
  @Input('email') email: string;
  @Input('isExisting') isExisting: boolean;
  @Output() closeFormEvent = new EventEmitter<void>();
  @Input('api') api: EditApi | null;
  public form: FormGroup;
  public backendErrors$: Observable<BackendErrorsInterface | null>;
  public markets = [{ name: 'Select a market', val: null }, ...markets];
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      apiKey: ['', [Validators.required]],
      secretKey: ['', [Validators.required]],
      apiName: ['', [Validators.required]],
      market: [''],
      passPhrase: [''],
      uEmail: [''],
    });
    if (this.isExisting) {
      this.form.get('uEmail')?.setValidators(Validators.required);
    } else {
      this.form.get('uEmail')?.clearValidators();
    }
  }

  // TODO проверить и вынести в инициализацию
  ngOnChanges(changes: SimpleChanges) {
    const apiVal = changes?.['api']?.currentValue || null;
    const marketId =
      markets.find((m) => m.name === apiVal?.market || '')?.val || '';
    this.form?.patchValue({
      apiKey: apiVal?.key || '',
      secretKey: apiVal?.secret || '',
      apiName: apiVal?.name || '',
      market: { name: apiVal?.market, val: marketId },
      passPhrase: apiVal?.passPhrase || '',
    });
  }

  initializeValues(): void {
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
  }

  onSubmit() {
    const { apiKey, secretKey, apiName, market, passPhrase, uEmail } =
      this.form.value;
    const key =
      this.isShowPassphrase(market.name) && passPhrase
        ? `${passPhrase}/${apiKey}`
        : apiKey;
    const email = this.isExisting ? uEmail : this.email;
    const namePrefix = email?.split('@')[0];
    const newApiName = apiName.startsWith(namePrefix)
      ? apiName
      : `${email?.split('@')[0]}_${apiName}`;
    const request = {
      key,
      secret: secretKey,
      email,
      apiName: newApiName,
      exchange: market.val,
    };

    if (this.form.status === 'VALID') {
      let action: any = !this.isExisting
        ? createApiAction({ request })
        : addExistingApiAction({ request });
      if (this.api != null) {
        action = editApiAction({
          request: {
            ...request,
            apiId: this.api.id || this.api.rev_id || '',
          },
        });
      }
      this.store.dispatch(action);
      this.form.reset();
      this.closeFormEvent.next();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        life: 10000,
        detail: 'Fill all fields',
      });
    }
  }

  isShowPassphrase(marketVal?: string): boolean {
    return isShowPassphrase(marketVal || this.form.value.market.name);
  }
}
