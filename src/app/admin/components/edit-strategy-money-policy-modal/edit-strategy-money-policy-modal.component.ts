import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BotStrategy } from '../../store/types/adminState.interface';

@Component({
  selector: 'app-edit-strategy-money-policy-modal',
  templateUrl: './edit-strategy-money-policy-modal.component.html',
  styleUrls: ['./edit-strategy-money-policy-modal.component.scss'],
})
export class EditStrategyMoneyPolicyModalComponent
  implements OnChanges, OnInit
{
  @Input() visible: boolean = false;
  @Input() strategy: BotStrategy | null = null;
  @Input() loading: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{
    strategyId: string;
    minDeposit?: number;
    actualLeverage?: number;
  }>();

  moneyPolicyForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.moneyPolicyForm = this.fb.group({
      minDeposit: [0, [Validators.required, Validators.min(0)]],
      actualLeverage: [0, [Validators.required, Validators.min(0.1)]],
    });
  }

  ngOnInit() {
    // При инициализации компонента заполняем поля, если strategy уже есть
    if (this.strategy && this.moneyPolicyForm) {
      this.patchFormValues(this.strategy);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Если изменилась strategy и она есть, заполняем поля
    if (
      changes['strategy'] &&
      changes['strategy'].currentValue &&
      this.moneyPolicyForm
    ) {
      const strategy = changes['strategy'].currentValue as BotStrategy;
      this.patchFormValues(strategy);
    }
  }

  private patchFormValues(strategy: BotStrategy) {
    this.moneyPolicyForm.patchValue({
      minDeposit: strategy.minDeposit || 0,
      actualLeverage: strategy.actualLeverage || 1,
    });
  }

  onShow() {
    // При открытии модалки заполняем поля, если strategy есть
    if (this.strategy) {
      this.patchFormValues(this.strategy);
    }
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.moneyPolicyForm.reset();
  }

  onSave() {
    if (!this.moneyPolicyForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Заполните все обязательные поля корректно',
      });
      return;
    }

    if (!this.strategy) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Стратегия не выбрана',
      });
      return;
    }

    const { minDeposit, actualLeverage } = this.moneyPolicyForm.value;

    const dataToSend = {
      strategyId: this.strategy.strategyId,
      minDeposit: Number(minDeposit),
      actualLeverage: Number(actualLeverage),
    };

    console.log('Modal onSave - form values:', this.moneyPolicyForm.value);
    console.log('Modal onSave - dataToSend:', dataToSend);

    this.save.emit(dataToSend);
  }
}
