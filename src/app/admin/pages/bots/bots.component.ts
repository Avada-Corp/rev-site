import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Bot } from '../../store/types/adminState.interface';
import { Select } from '../../shared';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store, select } from '@ngrx/store';
import { saveAllBotsAction } from '../../store/actions/saveAllBots.action';
import { Observable } from 'rxjs';
import { BotSettings } from 'src/app/shared/types/botSettings.interface';
import {
  botSettingsSelector,
  botsSelector,
  botStrategiesSelector,
} from '../../store/selectors';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { getBotSettingsAction } from '../../store/actions/botSettings.action';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { getBotsAction } from '../../store/actions/bots.action';
import { getBotStrategiesAction } from '../../store/actions/botStrategies.action';
import { BotStrategy } from '../../store/types/adminState.interface';
import { ControlApiService } from '../../services/controlApi.service';
import { copyStrategySettingsAction } from '../../store/actions/copyStrategySettings.action';

@Component({
  selector: 'app-bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.scss'],
})
export class BotsComponent implements OnInit, OnChanges {
  // @Input('email') email: string;
  // @Input('longBots') longBots: Bot[];
  // @Input('shortBots') shortBots: Bot[];
  // @Input('order_matrix') order_matrix: Select[];
  // @Input('botRefsTags') botRefsTags: Select[];
  public email: string = '';
  private user$: Observable<CurrentUserTokenResponseInterface | null>;
  botSettings$: Observable<BotSettings>;
  private bots$: Observable<Bot[]>;
  private botStrategies$: Observable<BotStrategy[]>;
  public longBots: Bot[] = [];
  public shortBots: Bot[] = [];
  public botStrategies: BotStrategy[] = [];
  public selectedStrategyId: string = '';
  public selectedStrategyDescription: string = '';
  public copyFromStrategyId: string = '';
  order_matrix: Select[];
  botRefsTags: Select[];
  public isSaveOrder: boolean = false;
  private previousBotsCount: number = 0;
  // TODO
  modifiedLongBots: any[];
  modifiedShortBots: any[];
  modifiedCandidateBots: any = null;

  constructor(
    private store: Store,
    private controlApiService: ControlApiService
  ) {}
  ngOnInit() {
    this.initializeValues();
    this.subscribe();
  }

  initializeValues() {
    this.user$ = this.store.pipe(select(currentUserSelector));
    this.botSettings$ = this.store.pipe(select(botSettingsSelector));
    this.bots$ = this.store.pipe(select(botsSelector));
    this.botStrategies$ = this.store.pipe(select(botStrategiesSelector));

    this.controlApiService.init(true);
  }

  subscribe() {
    this.user$.subscribe((user) => {
      this.email = user?.email || '';
      this.store.dispatch(getBotsAction());
      this.store.dispatch(getBotSettingsAction());
      this.store.dispatch(getBotStrategiesAction());
    });

    this.bots$.subscribe((bots) => {
      // Check if a new bot was created (bots count increased)
      if (
        bots.length > this.previousBotsCount &&
        this.modifiedCandidateBots !== null
      ) {
        this.modifiedCandidateBots = null; // Hide the creation form
      }
      this.previousBotsCount = bots.length;
      this.updateFilteredBots(bots);
    });

    this.botStrategies$.subscribe((strategies) => {
      this.botStrategies = strategies;
      // Автоматически выбираем консервативную стратегию по умолчанию
      if (strategies.length > 0 && !this.selectedStrategyId) {
        const conservativeStrategy =
          strategies.find((s) => s.strategyId === 'conservative') ||
          strategies[0]; // Если не найдена, берем первую

        this.selectedStrategyId = conservativeStrategy.strategyId;
        this.selectedStrategyDescription = conservativeStrategy.description;
      }
    });

    this.botSettings$.subscribe((s) => {
      this.order_matrix = [
        { name: '—Выберите—', value: null },
        ...s.matrixes.map((v) => ({
          name: v.title,
          value: v.id,
        })),
      ];
      this.botRefsTags = [
        ...s.tags.map((v) => ({
          name: v.title,
          value: v.id,
        })),
      ];
    });
  }

  private updateFilteredBots(bots: Bot[]) {
    let filteredBots = bots;
    if (this.selectedStrategyId) {
      filteredBots = bots.filter(
        (b) => b.strategyId === this.selectedStrategyId
      );
    }

    this.longBots = filteredBots.filter((b) => b.algo === 'long');
    this.modifiedLongBots = [...this.longBots];
    this.shortBots = filteredBots.filter((b) => b.algo === 'short');
    this.modifiedShortBots = [...this.shortBots];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['longBots'] != null) {
      const longBots = (changes?.['longBots'].currentValue as Bot[]) || [];
      this.modifiedLongBots = [...longBots];
      // this.modifiedLongBots.sort((a, b) => a.orderIndex - b.orderIndex);
      this.modifiedCandidateBots = null;
    }
    if (changes?.['shortBots'] != null) {
      const shortBots = (changes?.['shortBots'].currentValue as Bot[]) || [];
      this.modifiedShortBots = [...shortBots];
      // this.modifiedShortBots.sort((a, b) => a.orderIndex - b.orderIndex);
      this.modifiedCandidateBots = null;
    }
  }

  getMaxIndex(bots: Bot[]): number {
    return (
      (bots.sort((a, b) => a.orderIndex - b.orderIndex).slice(-1)[0]
        ?.orderIndex ?? bots.length) + 1
    );
  }

  addBot() {
    const maxLongIndex = this.getMaxIndex(this.modifiedLongBots);
    const maxShortIndex = this.getMaxIndex(this.modifiedShortBots);
    const newBot = {
      coin: '',
      algo: '',
      depo: '',
      leverage: '',
      id: '',
      isForStart: true,
      strategyId:
        this.selectedStrategyId ||
        (this.botStrategies.length > 0 ? this.botStrategies[0].strategyId : ''),
      orderIndexInfo: {
        long: maxLongIndex,
        short: maxShortIndex,
      },
    };
    this.modifiedCandidateBots = newBot;
  }
  drop(event: CdkDragDrop<string[]>, isLong: boolean) {
    moveItemInArray(
      isLong ? this.modifiedLongBots : this.modifiedShortBots,
      event.previousIndex,
      event.currentIndex
    );
    this.isSaveOrder = true;
  }
  saveBotOrder() {
    const newBotsOrdered = [
      ...this.modifiedLongBots,
      ...this.modifiedShortBots,
    ].map((bot, index) => ({
      ...bot,
      orderIndex: index,
    }));
    this.store.dispatch(
      saveAllBotsAction({
        email: this.email,
        bots: newBotsOrdered,
      })
    );
    this.isSaveOrder = false;
  }

  onStrategyChange(strategyId: string) {
    this.selectedStrategyId = strategyId;
    if (strategyId && this.botStrategies.length > 0) {
      const selectedStrategy = this.botStrategies.find(
        (s) => s.strategyId === strategyId
      );
      this.selectedStrategyDescription = selectedStrategy
        ? selectedStrategy.description
        : '';
    } else {
      this.selectedStrategyDescription = '';
    }
    // Перефильтровать ботов
    this.bots$
      .subscribe((bots) => {
        this.updateFilteredBots(bots);
      })
      .unsubscribe();
  }

  trackByBotId(index: number, bot: Bot): string {
    return bot.id;
  }

  getAvailableStrategiesForCopy(): BotStrategy[] {
    return this.botStrategies.filter(
      (s) => s.strategyId !== this.selectedStrategyId
    );
  }

  copyStrategySettings() {
    if (!this.selectedStrategyId) {
      alert('Выберите стратегию, В которую копировать');
      return;
    }

    if (!this.copyFromStrategyId) {
      alert('Выберите стратегию, ИЗ которой копировать');
      return;
    }

    const fromStrategy = this.botStrategies.find(
      (s) => s.strategyId === this.copyFromStrategyId
    );
    const toStrategy = this.botStrategies.find(
      (s) => s.strategyId === this.selectedStrategyId
    );

    if (
      confirm(
        `Вы уверены, что хотите скопировать настройки из "${fromStrategy?.name}" в "${toStrategy?.name}"?`
      )
    ) {
      this.store.dispatch(
        copyStrategySettingsAction({
          fromStrategyId: this.copyFromStrategyId,
          toStrategyId: this.selectedStrategyId,
        })
      );
      // Сбрасываем выбор после копирования
      this.copyFromStrategyId = '';
    }
  }
}
