import { Injectable } from '@angular/core';
import { Select } from '../shared';
import {
  algos,
  coins,
  filterCoins,
  positionmode,
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
  sf__id_op,
  filter_types,
  filter_periods,
} from '../shared';

@Injectable({
  providedIn: 'root',
})
export class BotOptionsCacheService {
  private cachedOptions: { [key: string]: Select[] } = {};

  constructor() {
    // Предварительно кэшируем все опции
    this.cacheAllOptions();
  }

  private cacheAllOptions(): void {
    this.cachedOptions = {
      algo: algos,
      pair: [...coins].sort((a, b) => a.name.localeCompare(b.name)),
      sf__pair: filterCoins,
      positionmode: positionmode,
      rate_cover: rate_cover,
      first_order_indent: first_order_indent,
      rate_mode: rate_mode,
      profit: profit,
      cycle_up: cycle_up,
      sleep_before_cancel: sleep_before_cancel,
      sleep_before_up: sleep_before_up,
      sleep_after_done: sleep_after_done,
      logarithmic_factor: logarithmic_factor,
      autorestart: autorestart,
      sf__id_op: sf__id_op,
      filter_types: filter_types,
      filter_periods: filter_periods,
    };
  }

  getAlgoOptions(): Select[] {
    return this.cachedOptions['algo'];
  }

  getPairOptions(): Select[] {
    return this.cachedOptions['pair'];
  }

  getSfPairOptions(): Select[] {
    return this.cachedOptions['sf__pair'];
  }

  getPositionModeOptions(): Select[] {
    return this.cachedOptions['positionmode'];
  }

  getRateCoverOptions(): Select[] {
    return this.cachedOptions['rate_cover'];
  }

  getFirstOrderIndentOptions(): Select[] {
    return this.cachedOptions['first_order_indent'];
  }

  getRateModeOptions(): Select[] {
    return this.cachedOptions['rate_mode'];
  }

  getProfitOptions(): Select[] {
    return this.cachedOptions['profit'];
  }

  getCycleUpOptions(): Select[] {
    return this.cachedOptions['cycle_up'];
  }

  getSleepBeforeCancelOptions(): Select[] {
    return this.cachedOptions['sleep_before_cancel'];
  }

  getSleepBeforeUpOptions(): Select[] {
    return this.cachedOptions['sleep_before_up'];
  }

  getSleepAfterDoneOptions(): Select[] {
    return this.cachedOptions['sleep_after_done'];
  }

  getLogarithmicFactorOptions(): Select[] {
    return this.cachedOptions['logarithmic_factor'];
  }

  getAutorestartOptions(): Select[] {
    return this.cachedOptions['autorestart'];
  }

  getSfIdOpOptions(): Select[] {
    return this.cachedOptions['sf__id_op'];
  }

  getFilterTypesOptions(): Select[] {
    return this.cachedOptions['filter_types'];
  }

  getFilterPeriodsOptions(): Select[] {
    return this.cachedOptions['filter_periods'];
  }
}
