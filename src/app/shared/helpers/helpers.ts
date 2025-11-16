export function isShowPassphrase(market: string): boolean {
  switch (market) {
    case '37':
    case '33':
    case 'Bitget':
    case 'OKX':
      return true;
  }
  return false;
}

export function generateRandomBase58String(length: number): string {
  let result = '';
  const characters =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Проверяет, был ли HTTP-запрос отменен
 * @param error - ошибка HTTP-запроса
 * @returns true если запрос был отменен, false если это реальная ошибка
 */
export function isRequestCancelled(error: any): boolean {
  // Проверяем различные индикаторы отмененного запроса
  return (
    error.name === 'AbortError' ||
    error.status === 0 ||
    error.statusText === 'Unknown Error' ||
    (error.error && error.error.type === 'abort')
  );
}

/**
 * Обрабатывает отмену HTTP-запроса и отправляет соответствующий action
 * @param error - ошибка HTTP-запроса
 * @param store - экземпляр Store для отправки action
 * @returns true если запрос был отменён, false если это обычная ошибка
 */
export function handleCancelledRequest(error: any, store?: any): boolean {
  if (isRequestCancelled(error)) {
    if (store) {
      // Импорт action будет добавлен позже в компоненте
      store.dispatch({ type: '[Admin] Request Cancelled' });
    }
    return true;
  }
  return false;
}

/**
 * Утилитный класс для управления состоянием загрузки
 */
export class LoadingStateManager {
  private loadingStates = new Map<string, boolean>();
  private loadingChangeCallback?: (isLoading: boolean) => void;

  constructor(private onLoadingChange?: (isLoading: boolean) => void) {
    this.loadingChangeCallback = onLoadingChange;
  }

  /**
   * Устанавливает состояние загрузки для конкретного ключа
   */
  setLoading(key: string, isLoading: boolean): void {
    this.loadingStates.set(key, isLoading);
    this.notifyLoadingChange();
  }

  /**
   * Проверяет, есть ли активные загрузки
   */
  get isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some((loading) => loading);
  }

  /**
   * Сбрасывает все состояния загрузки
   */
  resetAll(): void {
    this.loadingStates.clear();
    this.notifyLoadingChange();
  }

  /**
   * Сбрасывает конкретное состояние загрузки
   */
  reset(key: string): void {
    this.loadingStates.delete(key);
    this.notifyLoadingChange();
  }

  private notifyLoadingChange(): void {
    if (this.loadingChangeCallback) {
      this.loadingChangeCallback(this.isAnyLoading);
    }
  }
}
