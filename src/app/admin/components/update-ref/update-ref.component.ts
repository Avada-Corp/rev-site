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
import { updateRefPercentsAction } from '../../store/actions/updateRefPercents.action';

@Component({
  selector: 'app-update-ref',
  templateUrl: './update-ref.component.html',
  styleUrls: ['./update-ref.component.scss'],
})
export class UpdateRefComponent implements OnInit, OnChanges {
  @Input('refInfo') refInfo: {
    email: string;
    refPercent1: number | null;
    refPercent2: number | null;
    refPercent3: number | null;
    username: string | null;
  } | null;

  public form: FormGroup;
  constructor(private formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    const refInfo = changes?.['refInfo']?.currentValue || null;
    if (refInfo != null) {
      this.form?.patchValue({
        refPercent1: refInfo?.refPercent1 || '',
        refPercent2: refInfo?.refPercent2 || '',
        refPercent3: refInfo?.refPercent3 || '',
      });
    }
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      refPercent1: this.refInfo?.refPercent1 || null,
      refPercent2: this.refInfo?.refPercent2 || null,
      refPercent3: this.refInfo?.refPercent3 || null,
    });
  }
  onSubmit() {
    const { refPercent1, refPercent2, refPercent3 } = this.form.value;
    this.store.dispatch(
      updateRefPercentsAction({
        refPercent1,
        refPercent2,
        refPercent3,
        email: this.refInfo?.email || '',
      })
    );
  }
}
