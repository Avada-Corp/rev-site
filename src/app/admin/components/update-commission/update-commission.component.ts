import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PrivateCommission } from '../../store/types/adminState.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateApiPrivateCommissionAction } from '../../store/actions/updateApiPrivateCommission.action';
import { updateUserPrivateCommissionAction } from '../../store/actions/updateUserPrivateCommission.action';

@Component({
  selector: 'app-update-commission',
  templateUrl: './update-commission.component.html',
  styleUrls: ['./update-commission.component.scss'],
})
export class UpdateCommissionComponent implements OnInit, OnChanges {
  @Input('apiCommission') apiCommission:
    | (PrivateCommission & {
        apiName: string;
        apiKey: string;
      })
    | null;
  @Input('userCommission') userCommission:
    | (PrivateCommission & {
        email: string;
        username: string;
      })
    | null;

  public form: FormGroup;
  constructor(private formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    const userChanges = changes?.['userCommission'];
    const apiChanges = changes?.['apiCommission'];
    if (userChanges != null) {
      const userCommission = userChanges.currentValue || null;
      this.form?.patchValue({
        percent: userCommission?.percent || '',
        absolute: userCommission?.absolute || '',
        email: userCommission?.email || '',
        username: userCommission?.username || '',
      });
    }
    if (apiChanges != null) {
      const apiCommission = apiChanges.currentValue || null;
      this.form?.patchValue({
        percent: apiCommission?.percent || '',
        absolute: apiCommission?.absolute || '',
        apiKey: apiCommission?.apiKey || '',
        apiName: apiCommission?.apiName || '',
      });
    }
  }

  initializeForm() {
    if (this.userCommission != null) {
      this.form = this.formBuilder.group({
        percent: this.userCommission.percent,
        absolute: this.userCommission.absolute,
        email: this.userCommission?.email || '',
        username: this.userCommission?.username || '',
      });
    } else if (this.apiCommission != null) {
      this.form = this.formBuilder.group({
        percent: this.apiCommission.percent,
        absolute: this.apiCommission.absolute,
        apiKey: this.apiCommission?.apiKey || '',
      });
    }
  }
  onSubmit() {
    const { percent, absolute, apiKey, email } = this.form.value;
    if (email != null) {
      this.store.dispatch(
        updateUserPrivateCommissionAction({ percent, absolute, email })
      );
    } else if (apiKey != null) {
      this.store.dispatch(
        updateApiPrivateCommissionAction({ percent, absolute, apiKey })
      );
    }
  }
}
