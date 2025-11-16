import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiWithEmail } from '../../store/types/adminState.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { editApiAction } from 'src/app/page/store/actions/editApi.action';
import { EditApiInterface } from 'src/app/auth/types/editApiInterface';

@Component({
  selector: 'app-edit-user-api',
  templateUrl: './edit-user-api.component.html',
  styleUrls: ['./edit-user-api.component.scss'],
})
export class EditUserApiComponent {
  @Input('api') api: ApiWithEmail;

  public form: FormGroup;
  constructor(private formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      key: [this.api.key, [Validators.required]],
      secret: [this.api.secret, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const apiVal = changes?.['api']?.currentValue || null;
    this.form?.patchValue({
      key: apiVal?.key || '',
      secret: apiVal?.secret || '',
    });
  }

  onSubmit() {
    const request: EditApiInterface = this.form.value;
    const { key, secret } = request;
    const editRequest = {
      apiId: this.api.rev_id,
      email: this.api.email,
      key,
      secret,
      apiName: this.api.name,
      exchange: this.api.market,
    };
    this.store.dispatch(
      editApiAction({
        request: editRequest,
      })
    );
  }
}
