import { Component, Input, OnInit } from '@angular/core';
import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { Store } from '@ngrx/store';
import { startBotAction } from '../store/actions/startBot.action';
import { stopBotAction } from '../store/actions/stopBot.action';
import { fullStopBotAction } from '../store/actions/fullStopBot.action';

@Component({
  selector: 'app-bot-action-button',
  templateUrl: './bot-action-button.component.html',
  styleUrls: ['./bot-action-button.component.scss'],
})
export class BotActionButtonComponent implements OnInit {
  @Input('status') status: BotStatus;
  @Input('apiId') apiId: string;
  @Input('email') email: string;
  botStatuses: typeof BotStatus = BotStatus;
  constructor(private store: Store) {}

  ngOnInit(): void {}
  startBot() {
    const startData = { email: this.email, apiId: this.apiId };
    if (confirm('Запустить?')) {
      this.store.dispatch(startBotAction(startData));
    }
  }
  stopBot() {
    if (confirm('Остановить процессы?')) {
      this.store.dispatch(
        stopBotAction({ email: this.email, apiId: this.apiId })
      );
    }
  }
  fullStopBot() {
    if (
      confirm(
        'Экстренная остановка без ожидания завершения циклов. Может привести к убыткам. Отменятся все ордера'
      )
    ) {
      this.store.dispatch(
        fullStopBotAction({ email: this.email, apiId: this.apiId })
      );
    }
  }
}
