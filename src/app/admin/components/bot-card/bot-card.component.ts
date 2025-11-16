import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Bot, BotFilter } from './../../store/types/adminState.interface';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { updateBotAction } from '../../store/actions/botUpdate.action';
import { removeBotAction } from '../../store/actions/removeBot.action';
import { coins, filterCoins } from '../../shared/coins';
import { BotStrategy } from '../../store/types/adminState.interface';
import { botStrategiesSelector } from '../../store/selectors';
import {
  rate_cover,
  first_order_indent,
  rate_mode,
  profit,
  cycle_up,
  sleep_before_cancel,
  sleep_before_up,
  sleep_after_done,
  logarithmic_factor,
  autorestart,
  Select,
  positionmode,
  algos,
} from '../../shared';
import {
  atLeastStringOne,
  forbiddenNameValidator,
} from '../../shared/validators';
import { BotSettings } from 'src/app/shared/types/botSettings.interface';
import { Observable } from 'rxjs';
import { botSettingsSelector } from '../../store/selectors';
import { BotOptionsCacheService } from '../../services/bot-options-cache.service';
import { MessageService } from 'primeng/api';

// Кэш для результатов convertValToObj
const convertCache = new Map<string, any>();

function convertValToObj(val: any, base: Select[]) {
  if (val == null) {
    return { name: '—Выберите—', value: null };
  }

  // Создаем уникальный ключ для кэширования
  const cacheKey = `${val}_${base?.length || 0}_${base?.[0]?.value || ''}_${
    base?.[base.length - 1]?.value || ''
  }`;

  if (convertCache.has(cacheKey)) {
    return convertCache.get(cacheKey);
  }

  const nameVal = base?.find((b) => b.value === val)?.name || val;
  const result = { name: nameVal, value: val };

  // Кэшируем результат (ограничим размер кэша)
  if (convertCache.size > 1000) {
    convertCache.clear();
  }
  convertCache.set(cacheKey, result);

  return result;
}

@Component({
  selector: 'app-bot-card',
  templateUrl: './bot-card.component.html',
  styleUrls: ['./bot-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotCardComponent implements OnInit, OnChanges {
  @Input('bot') bot: Bot;
  @Input('email') email: string;
  @Input('order_matrix') order_matrix: Select[];
  @Input('refs') refs: Select[];
  @Input('strategies') strategies: BotStrategy[] = [];
  public form: FormGroup;
  private isInitialized = false;
  public isFormInitialized = false;
  algo: Select[];
  pair: Select[];
  sf__pair: Select[];
  positionmode: Select[];
  rate_cover: Select[];
  first_order_indent: Select[];
  rate_mode: Select[];
  // TODO
  profit: Select[];
  cycle_up: Select[];
  sleep_before_cancel: Select[];
  sleep_before_up: Select[];
  sleep_after_done: Select[];
  logarithmic_factor: Select[];
  autorestart: Select[];
  sf__id_op: Select[];
  filter_types: Select[];
  filter_periods: Select[];
  // TODO

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private optionsCache: BotOptionsCacheService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Инициализируем только массивы опций, форму инициализируем лениво
    if (!this.isInitialized) {
      this.initializeValues();
      this.isInitialized = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // При изменении бота или других входных свойств
    if (
      this.isInitialized &&
      (changes['bot'] ||
        changes['order_matrix'] ||
        changes['refs'] ||
        changes['strategies'])
    ) {
      this.cdr.markForCheck();
    }
  }

  onAccordionOpen(): void {
    // Ленивая инициализация формы только при открытии accordion
    if (!this.isFormInitialized) {
      this.initializeForm();
      this.isFormInitialized = true;
      this.cdr.markForCheck();
    }
  }

  initializeForm() {
    // Инициализируем фильтры из старых полей или из нового массива
    let initialFilters: BotFilter[] = [];

    if (this.bot.filters && this.bot.filters.length > 0) {
      // Преобразуем фильтры с бэкенда в нужный формат
      initialFilters = this.bot.filters.map((filter: any) => {
        const converted: BotFilter = {
          filter_type: filter.type || filter.filter_type,
          value: filter.value || '',
          pair: filter.pair || null,
          operation: filter.operation,
          data: filter.data,
        };

        // Для BB фильтров парсим period и length из id
        if ((filter.type === 'bb_l' || filter.type === 'bb_u') && filter.id) {
          // Формат id: "bb_l:bb-lb-15m:value" или "bb_u:bb-ub-1h:value"
          const idParts = filter.id.split(':');
          if (idParts.length >= 2) {
            const middlePart = idParts[1]; // "bb-lb-15m" или "bb-ub-1h"
            const periodMatch = middlePart.match(/-([\dhmsd]+)$/);
            if (periodMatch) {
              converted.period = periodMatch[1];
            }
          }
          // length приходит отдельным полем
          if (filter.length) {
            converted.length = filter.length;
          }
        }

        return converted;
      });
    } else if (this.bot.sf__id_op || this.bot.sf__value) {
      // Конвертируем старый формат в новый (RSI фильтр)
      initialFilters = [
        {
          filter_type: 'rsi',
          operation: this.bot.sf__id_op,
          value: this.bot.sf__value || '',
          data: this.bot.sf__data,
          pair: this.bot.sf__pair || '',
        },
      ];
    }

    this.form = this.formBuilder.group(
      {
        name: [this.bot.name, [Validators.required]],
        pair: [
          convertValToObj(this.bot.pair, this.pair),
          [Validators.required],
        ],
        algo: [
          convertValToObj(this.bot.algo, this.algo),
          [Validators.required, forbiddenNameValidator('algo')],
        ],
        isAutoDepoCount: [this.bot.isAutoDepoCount],
        depo_percent: [this.bot.depo_percent],
        depo_abs: [this.bot.depo_abs],
        leverage: [this.bot.leverage, [Validators.required]],
        positionmode: [
          convertValToObj(this.bot.positionmode, this.positionmode),
          [Validators.required, forbiddenNameValidator('positionmode')],
        ],
        id: [this.bot.id],
        rate_cover: [
          convertValToObj(this.bot.rate_cover, this.rate_cover),
          [Validators.required, forbiddenNameValidator('rate_cover')],
        ],
        first_order_indent: [
          convertValToObj(this.bot.first_order_indent, this.first_order_indent),
          [Validators.required, forbiddenNameValidator('first_order_indent')],
        ],
        rate_mode: [
          convertValToObj(this.bot.rate_mode, this.rate_mode),
          [Validators.required, forbiddenNameValidator('rate_mode')],
        ],
        order_matrix: [
          convertValToObj(this.bot.order_matrix, this.order_matrix),
          [Validators.required, forbiddenNameValidator('order_matrix')],
        ],
        part_orders_enabled: [this.bot.part_orders_enabled],
        part_orders_value: [this.bot.part_orders_value],
        profit: [
          convertValToObj(this.bot.profit, this.profit),
          [Validators.required, forbiddenNameValidator('profit')],
        ],
        cycle_up: [
          convertValToObj(this.bot.cycle_up, this.cycle_up),
          [Validators.required, forbiddenNameValidator('cycle_up')],
        ],
        sleep_before_cancel: [
          convertValToObj(
            this.bot.sleep_before_cancel,
            this.sleep_before_cancel
          ),
          [Validators.required, forbiddenNameValidator('sleep_before_cancel')],
        ],
        sleep_before_up: [
          convertValToObj(this.bot.sleep_before_up, this.sleep_before_up),
          [Validators.required, forbiddenNameValidator('sleep_before_up')],
        ],
        sleep_after_done: [
          convertValToObj(this.bot.sleep_after_done, this.sleep_after_done),
          [Validators.required, forbiddenNameValidator('sleep_after_done')],
        ],
        logarithmic_scale_for_orders: [this.bot.logarithmic_scale_for_orders],
        logarithmic_factor: [
          convertValToObj(this.bot.logarithmic_factor, this.logarithmic_factor),
        ],
        autorestart: [convertValToObj(this.bot.autorestart, this.autorestart)],
        start_filters_enabled: [this.bot.start_filters_enabled],
        filters: this.formBuilder.array(
          initialFilters.map((filter) => this.createFilterFormGroup(filter))
        ),
        botRefsTags: [this.bot.botRefsTags?.map((b) => b.name)],
        isForStart: [this.bot.isForStart],
      },
      {
        validator: atLeastStringOne(
          'depo_percent',
          'depo_abs',
          'isAutoDepoCount'
        ),
      }
    );
  }

  createFilterFormGroup(filter?: BotFilter): FormGroup {
    return this.formBuilder.group({
      filter_type: [
        convertValToObj(filter?.filter_type, this.filter_types),
        [Validators.required],
      ],
      operation: [convertValToObj(filter?.operation, this.sf__id_op)],
      value: [filter?.value || ''],
      period: [convertValToObj(filter?.period, this.filter_periods)],
      length: [filter?.length || ''],
      pair: [
        convertValToObj(filter?.pair, this.sf__pair),
        [Validators.required],
      ],
      data: [filter?.data || ''],
    });
  }

  get filtersArray(): FormArray {
    return this.form.get('filters') as FormArray;
  }

  addFilter(): void {
    this.filtersArray.push(this.createFilterFormGroup());
    this.cdr.markForCheck();
  }

  removeFilter(index: number): void {
    this.filtersArray.removeAt(index);
    this.cdr.markForCheck();
  }

  getFilterType(index: number): string {
    const filterGroup = this.filtersArray.at(index) as FormGroup;
    const filterTypeControl = filterGroup.get('filter_type');
    return filterTypeControl?.value?.value || null;
  }

  initializeValues() {
    this.algo = this.optionsCache.getAlgoOptions();
    this.pair = this.optionsCache.getPairOptions();
    this.sf__pair = this.optionsCache.getSfPairOptions();
    this.positionmode = this.optionsCache.getPositionModeOptions();
    this.rate_cover = this.optionsCache.getRateCoverOptions();
    this.first_order_indent = this.optionsCache.getFirstOrderIndentOptions();
    this.rate_mode = this.optionsCache.getRateModeOptions();
    this.profit = this.optionsCache.getProfitOptions();
    this.cycle_up = this.optionsCache.getCycleUpOptions();
    this.sleep_before_cancel = this.optionsCache.getSleepBeforeCancelOptions();
    this.sleep_before_up = this.optionsCache.getSleepBeforeUpOptions();
    this.sleep_after_done = this.optionsCache.getSleepAfterDoneOptions();
    this.logarithmic_factor = this.optionsCache.getLogarithmicFactorOptions();
    this.autorestart = this.optionsCache.getAutorestartOptions();
    this.sf__id_op = this.optionsCache.getSfIdOpOptions();
    this.filter_types = this.optionsCache.getFilterTypesOptions();
    this.filter_periods = this.optionsCache.getFilterPeriodsOptions();
  }

  onSubmit() {
    const { value } = this.form;
    if (this.form.valid) {
      const request: {
        [key: string]: any;
      } = {};
      for (const key of Object.keys(value)) {
        if (key === 'filters') {
          // Обрабатываем фильтры отдельно
          continue;
        }
        if (value[key] == null) {
          request[key] = null;
        } else if (value[key].name != null) {
          if (key === 'botRefsTags') {
            request[key] = value[key];
          } else {
            request[key] = value[key].value;
          }
        } else {
          if (key === 'botRefsTags') {
            request[key] = value[key].map((val: any) =>
              this.refs.find((r) => r.name === val)
            );
          } else {
            request[key] = value[key];
          }
        }
      }

      // Конвертируем фильтры в нужный формат для бэкенда
      const filters: any[] = [];
      if (value.filters && value.filters.length > 0) {
        for (const filter of value.filters) {
          const filterType = filter.filter_type?.value || filter.filter_type;
          const operation = filter.operation?.value || filter.operation;
          const period = filter.period?.value || filter.period;
          // Извлекаем значение пары: если это объект с value, берем value, иначе само значение
          // Если value === null или undefined, то pair будет null
          let pair = null;
          if (filter.pair) {
            if (typeof filter.pair === 'object' && 'value' in filter.pair) {
              pair = filter.pair.value; // Может быть null
            } else {
              pair = filter.pair;
            }
          }
          const filterValue = filter.value;
          const length = filter.length;
          const data = filter.data;

          // Проверяем обязательные поля
          if (!filterType) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Пропущен фильтр',
              detail: 'Не указан тип фильтра',
            });
            continue;
          }

          let filterObj: any = {
            type: filterType,
            pair: pair, // null означает текущую пару бота на сервере
          };

          if (filterType === 'rsi') {
            // RSI фильтр
            if (!filterValue) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Пропущен RSI фильтр',
                detail: 'Не указано значение индикатора',
              });
              continue; // value обязателен для RSI
            }
            filterObj.id = `rsi:rsi 6h-15m:value`;
            filterObj.value = filterValue;
            filterObj.operation = operation || '>';
            if (data) {
              filterObj.data = data;
            }
          } else if (filterType === 'bb_l') {
            // BB lower
            if (!length) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Пропущен BB lower фильтр',
                detail: 'Не указана длина (1-144)',
              });
              continue; // length обязателен для BB
            }
            filterObj.id = `bb_l:bb-lb-${period}:value`;
            filterObj.period = period;
            filterObj.length = length;
          } else if (filterType === 'bb_u') {
            // BB upper
            if (!length) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Пропущен BB upper фильтр',
                detail: 'Не указана длина (1-144)',
              });
              continue; // length обязателен для BB
            }
            filterObj.id = `bb_u:bb-ub-${period}:value`;
            filterObj.period = period;
            filterObj.length = length;
          }

          filters.push(filterObj);
        }
      }

      request['filters'] = filters;

      const orderIndex =
        this.bot.orderIndex ??
        (request['algo'] === 'long'
          ? this.bot.orderIndexInfo.long
          : this.bot.orderIndexInfo.short);

      this.store.dispatch(
        updateBotAction({
          email: this.email,
          bot: {
            ...request,
            id: request['id'] || '-1',
            orderIndex,
            strategyId: this.bot.strategyId,
          },
        })
      );
    } else {
      alert('Не все обязательные поля заполнены');
    }
  }
  resetForm() {
    this.form.patchValue(this.bot);
  }
  deleteBot() {
    if (confirm('Вы уверены, что хотите удалить бота?')) {
      this.store.dispatch(
        removeBotAction({
          email: this.email,
          id: this.bot.id,
        })
      );
    }
  }
}
