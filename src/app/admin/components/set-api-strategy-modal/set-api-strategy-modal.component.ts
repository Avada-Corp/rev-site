import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BotStrategy } from '../../store/types/adminState.interface';
import { botStrategiesSelector } from '../../store/selectors';
import { setApiStrategyAction } from '../../store/actions/setApiStrategy.action';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-set-api-strategy-modal',
  templateUrl: './set-api-strategy-modal.component.html',
  styleUrls: ['./set-api-strategy-modal.component.scss'],
})
export class SetApiStrategyModalComponent implements OnInit {
  @Input() email: string = '';
  @Input() apiName: string = '';
  @Output() closeEvent = new EventEmitter<void>();

  botStrategies$: Observable<BotStrategy[]>;
  selectedStrategyId: string = '';
  isLoading: boolean = false;

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService
  ) {
    this.botStrategies$ = this.store.select(botStrategiesSelector);
  }

  ngOnInit(): void {}

  onSave(): void {
    if (!this.selectedStrategyId) {
      return;
    }

    this.confirmationService.confirm({
      message:
        'Вы уверены, что хотите изменить стратегию? Будет запущена актуализация на данном ключе',
      header: 'Подтверждение изменения стратегии',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
      accept: () => {
        this.isLoading = true;
        this.store.dispatch(
          setApiStrategyAction({
            email: this.email,
            apiName: this.apiName,
            strategyId: this.selectedStrategyId,
          })
        );

        // Закрываем модалку после небольшой задержки
        setTimeout(() => {
          this.isLoading = false;
          this.close();
        }, 500);
      },
    });
  }

  close(): void {
    this.closeEvent.emit();
  }
}
