import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { UserRole } from 'src/app/shared/types/userRole.enum';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import {
  commissionTextsSelector,
  isCommissionTextLoadingSelector,
  botStrategiesSelector,
  isLoadingSelector,
  botsSelector,
  scenesSelector,
  isScenesLoadingSelector,
} from '../../store/selectors';
import {
  getCommissionTextAction,
  saveCommissionTextAction,
  getScenesAction,
  saveScenesAction,
  updateSceneAction,
  createSceneAction,
  deleteSceneAction,
} from '../../store/actions/settings.actions';
import {
  getBotStrategiesAction,
  editBotStrategyAction,
} from '../../store/actions/botStrategies.action';
import { getBotsAction } from '../../store/actions/bots.action';
import { Lang } from 'src/app/shared/types/lang.enum';
import { BotStrategy, Bot, Scene, SceneWithPreview } from '../../store/types/adminState.interface';
import { ConfirmationService } from 'primeng/api';

interface StrategyWithMetrics extends BotStrategy {
  botCount?: number;
  realLeverage?: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private user$: Observable<CurrentUserTokenResponseInterface | null>;
  commissionTexts$: Observable<{ ru: string; en: string }>;
  isLoading$: Observable<boolean>;
  botStrategies$: Observable<BotStrategy[]>;
  bots$: Observable<Bot[]>;
  scenes$: Observable<SceneWithPreview[]>;
  isScenesLoading$: Observable<boolean>;
  vm$: Observable<{
    isSuperAdmin: boolean;
    commissionTexts: { ru: string; en: string };
    currentLanguage: string;
    isLoading: boolean;
    botStrategies: StrategyWithMetrics[];
    scenes: SceneWithPreview[];
    isScenesLoading: boolean;
  }>;

  isModalVisible = false;
  isStrategyModalVisible = false;
  isMoneyPolicyModalVisible = false;
  isCalculationsModalVisible = false;
  isFunnelModalVisible = false;
  selectedScene: SceneWithPreview | null = null;
  currentLanguage: string = 'ru';
  isSuperAdmin: boolean = false;
  selectedStrategy: StrategyWithMetrics | null = null;
  customDeposit: number = 0;

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService
  ) {
    this.user$ = this.store.pipe(select(currentUserSelector));
    this.commissionTexts$ = this.store.select(commissionTextsSelector);
    this.isLoading$ = this.store.select(isCommissionTextLoadingSelector);
    this.botStrategies$ = this.store.select(botStrategiesSelector);
    this.bots$ = this.store.select(botsSelector);
    this.scenes$ = this.store.select(scenesSelector);
    this.isScenesLoading$ = this.store.select(isScenesLoadingSelector);

    this.vm$ = combineLatest([
      this.user$,
      this.commissionTexts$,
      this.isLoading$,
      this.botStrategies$,
      this.bots$,
      this.scenes$,
      this.isScenesLoading$,
    ]).pipe(
      map(([user, commissionTexts, isLoading, botStrategies, bots, scenes, isScenesLoading]) => ({
        isSuperAdmin: user?.userRole === UserRole.SuperAdmin,
        commissionTexts,
        currentLanguage: this.currentLanguage,
        isLoading,
        botStrategies: this.enrichStrategiesWithMetrics(botStrategies, bots),
        scenes: this.sortScenes(scenes || []),
        isScenesLoading,
      }))
    );
  }

  ngOnInit(): void {
    // Load current commission text when component initializes
    this.store.dispatch(getCommissionTextAction());
    // Load bot strategies
    this.store.dispatch(getBotStrategiesAction());
    // Load all bots for metrics calculation
    this.store.dispatch(getBotsAction());
    // Load scenes
    this.store.dispatch(getScenesAction());

    // Subscribe to user changes to update isSuperAdmin
    this.user$.subscribe((user) => {
      this.isSuperAdmin = user?.userRole === UserRole.SuperAdmin;
    });
  }

  private sortScenes(scenes: SceneWithPreview[]): SceneWithPreview[] {
    return [...scenes].sort((a, b) => {
      // Сначала сцена с sceneId = "start"
      if (a.sceneId === 'start' && b.sceneId !== 'start') {
        return -1;
      }
      if (a.sceneId !== 'start' && b.sceneId === 'start') {
        return 1;
      }
      // Затем сортируем по алфавиту
      return a.sceneId.localeCompare(b.sceneId);
    });
  }

  private enrichStrategiesWithMetrics(
    strategies: BotStrategy[],
    bots: Bot[]
  ): StrategyWithMetrics[] {
    return strategies.map((strategy) => {
      // Фильтруем боты по strategyId и algo === 'long'
      const strategyBots = bots.filter(
        (bot) => bot.strategyId === strategy.strategyId && bot.algo === 'long'
      );

      // Считаем количество ботов с algo === 'long'
      const botCount = strategyBots.length;

      // Берем плечо из первого бота стратегии
      const realLeverage =
        strategyBots.length > 0
          ? parseFloat(strategyBots[0].leverage)
          : undefined;

      return {
        ...strategy,
        botCount,
        realLeverage,
      };
    });
  }

  onEditCommissionText() {
    this.isModalVisible = true;
    // При открытии модального окна убедимся, что currentLanguage актуален
  }

  onModalClose() {
    this.isModalVisible = false;
  }

  onSaveCommissionText(data: { text: string; lang: Lang }) {
    this.currentLanguage = data.lang;
    this.store.dispatch(
      saveCommissionTextAction({ text: data.text, lang: data.lang })
    );
    this.isModalVisible = false;
  }

  onLanguageChange(language: string) {
    this.currentLanguage = language;
    // Обновляем vm$ чтобы передать новый язык в модальное окно
    // Это вызовет ngOnChanges в модальном компоненте
  }

  onEditStrategy(strategy: StrategyWithMetrics) {
    this.selectedStrategy = strategy;
    this.isStrategyModalVisible = true;
  }

  onStrategyModalClose() {
    this.isStrategyModalVisible = false;
    this.selectedStrategy = null;
  }

  onSaveStrategy(data: {
    strategyId: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    isSpot?: boolean;
  }) {
    this.store.dispatch(editBotStrategyAction(data));
    this.isStrategyModalVisible = false;
    this.selectedStrategy = null;
  }

  onEditMoneyPolicy(strategy: StrategyWithMetrics) {
    this.selectedStrategy = strategy;
    this.isMoneyPolicyModalVisible = true;
  }

  onMoneyPolicyModalClose() {
    this.isMoneyPolicyModalVisible = false;
    this.selectedStrategy = null;
  }

  onSaveMoneyPolicy(data: {
    strategyId: string;
    minDeposit?: number;
    actualLeverage?: number;
  }) {
    console.log('onSaveMoneyPolicy data:', data); // Для отладки

    if (!this.selectedStrategy) {
      console.error('No selected strategy!');
      return;
    }

    // Теперь сохраняем настройки как часть editBotStrategy
    this.store.dispatch(
      editBotStrategyAction({
        strategyId: data.strategyId,
        name: this.selectedStrategy.name,
        nameEn: this.selectedStrategy.nameEn,
        description: this.selectedStrategy.description,
        descriptionEn: this.selectedStrategy.descriptionEn,
        minDeposit: data.minDeposit,
        actualLeverage: data.actualLeverage,
        isSpot: this.selectedStrategy.isSpot,
      })
    );
    this.isMoneyPolicyModalVisible = false;
    this.selectedStrategy = null;
  }

  onShowCalculations(strategy: StrategyWithMetrics) {
    this.selectedStrategy = strategy;
    this.isCalculationsModalVisible = true;
  }

  onCalculationsModalClose() {
    this.isCalculationsModalVisible = false;
    this.selectedStrategy = null;
    this.customDeposit = 0;
  }

  // Расчет депозита 1: На 15% меньше минимального
  calculateDeposit1(): number {
    if (!this.selectedStrategy || !this.selectedStrategy.minDeposit) {
      return 0;
    }
    return this.selectedStrategy.minDeposit * 0.85;
  }

  // Расчет депозита 2: Средняя цифра между минимальным и (количество ботов * минимальный депозит)
  calculateDeposit2(): number {
    if (
      !this.selectedStrategy ||
      !this.selectedStrategy.minDeposit ||
      this.selectedStrategy.botCount === undefined
    ) {
      return 0;
    }
    const min = this.selectedStrategy.minDeposit;
    const max = this.selectedStrategy.botCount * min;
    return (min + max) / 2;
  }

  // Расчет депозита 3: Количество ботов * 2 * минимальный депозит
  calculateDeposit3(): number {
    if (
      !this.selectedStrategy ||
      !this.selectedStrategy.minDeposit ||
      this.selectedStrategy.botCount === undefined
    ) {
      return 0;
    }
    return (
      this.selectedStrategy.botCount * 2 * this.selectedStrategy.minDeposit
    );
  }

  // Обработка изменения кастомного депозита
  onCustomDepositChange(): void {
    // Можно добавить дополнительную логику при изменении
  }

  onEditFunnel(scene?: SceneWithPreview) {
    this.selectedScene = scene || null;
    this.isFunnelModalVisible = true;
    if (!scene) {
      this.store.dispatch(getScenesAction());
    }
  }

  onAddNewScene() {
    this.selectedScene = null;
    this.isFunnelModalVisible = true;
  }

  onFunnelModalClose() {
    this.isFunnelModalVisible = false;
    this.selectedScene = null;
  }

  onSaveScene(data: {scene: Scene, files: {welcomeImage?: File, reminderImages: {[key: number]: File}}}) {
    const {scene, files} = data;

    if (this.selectedScene) {
      // Редактирование существующей сцены
      this.store.dispatch(updateSceneAction({ scene, files }));
    } else {
      // Создание новой сцены
      this.store.dispatch(createSceneAction({ scene, files }));
    }
    this.isFunnelModalVisible = false;
    this.selectedScene = null;
  }

  onDeleteScene(scene: SceneWithPreview) {
    const sceneDisplayName = scene.name || scene.sceneId;
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите удалить сцену "${sceneDisplayName}"? Это действие нельзя отменить.`,
      header: 'Подтверждение удаления',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(deleteSceneAction({ sceneId: scene.sceneId }));
      },
      reject: () => {
        // Ничего не делаем, пользователь отменил
      },
    });
  }

  // Расчет количества ботов: депозит / минимальный депозит, минимум 1, максимум - количество ботов стратегии
  calculateBotCount(deposit: number): number {
    if (
      !this.selectedStrategy ||
      !this.selectedStrategy.minDeposit ||
      deposit <= 0
    ) {
      return 1;
    }

    const calculatedBots = Math.max(
      1,
      Math.floor(deposit / this.selectedStrategy.minDeposit)
    );

    // Ограничиваем количество ботов реальным количеством ботов стратегии
    if (this.selectedStrategy.botCount !== undefined) {
      return Math.min(calculatedBots, this.selectedStrategy.botCount);
    }

    return calculatedBots;
  }

  // Расчет процента для лонга
  calculateLongPercent(deposit: number): number {
    if (
      !this.selectedStrategy ||
      !this.selectedStrategy.minDeposit ||
      !this.selectedStrategy.actualLeverage ||
      !this.selectedStrategy.realLeverage ||
      deposit <= 0
    ) {
      return 0;
    }

    const minDeposit = this.selectedStrategy.minDeposit;
    const actualLeverage = this.selectedStrategy.actualLeverage;
    const realLeverage = this.selectedStrategy.realLeverage;
    const botCount = this.calculateBotCount(deposit);
    const recommendedDeposit = botCount * minDeposit;

    // Если депозит больше или равен рекомендованному
    if (deposit >= recommendedDeposit) {
      return (actualLeverage / (realLeverage * botCount)) * 100;
    }

    // Если депозит меньше рекомендованного, но больше или равен минимальному
    if (deposit >= minDeposit) {
      return ((actualLeverage / realLeverage) * 100 * minDeposit) / deposit;
    }

    // Если депозит меньше минимального
    return (actualLeverage / realLeverage) * 100;
  }

  // Расчет шорта в абсолютных значениях USDT
  calculateShortUsdt(deposit: number): number {
    if (
      !this.selectedStrategy ||
      !this.selectedStrategy.minDeposit ||
      !this.selectedStrategy.actualLeverage ||
      !this.selectedStrategy.realLeverage ||
      deposit <= 0
    ) {
      return 0;
    }

    const minDeposit = this.selectedStrategy.minDeposit;
    const actualLeverage = this.selectedStrategy.actualLeverage;
    const realLeverage = this.selectedStrategy.realLeverage;
    const botCount = this.calculateBotCount(deposit);
    const recommendedDeposit = botCount * minDeposit;

    // Если депозит больше или равен рекомендованному
    if (deposit >= recommendedDeposit) {
      return (deposit * actualLeverage) / (realLeverage * botCount);
    }

    // Если депозит меньше рекомендованного, но больше или равен минимальному
    if (deposit >= minDeposit) {
      return ((actualLeverage / realLeverage) * 100 * minDeposit) / 100;
    }

    // Если депозит меньше минимального
    return (actualLeverage / realLeverage) * deposit;
  }
}
