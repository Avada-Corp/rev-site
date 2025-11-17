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

/**
 * Интерфейс для части multipart/form-data
 */
export interface MultipartPart {
  name: string;
  data: ArrayBuffer;
  type?: string;
  filename?: string;
}

/**
 * Парсит multipart/form-data ответ
 * @param arrayBuffer - бинарные данные ответа
 * @param boundary - boundary из Content-Type заголовка
 * @returns массив частей multipart
 */
export function parseMultipartFormData(
  arrayBuffer: ArrayBuffer,
  boundary: string
): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const dataView = new Uint8Array(arrayBuffer);
  const boundaryBytes = new TextEncoder().encode(`--${boundary}`);
  const boundaryEndBytes = new TextEncoder().encode(`--${boundary}--`);
  
  let currentIndex = 0;
  
  // Находим начало первого boundary
  while (currentIndex < dataView.length) {
    const boundaryIndex = findBytes(dataView, boundaryBytes, currentIndex);
    if (boundaryIndex === -1) {
      break;
    }
    
    // Пропускаем boundary и CRLF
    let partStart = boundaryIndex + boundaryBytes.length;
    if (dataView[partStart] === 0x0D && dataView[partStart + 1] === 0x0A) {
      partStart += 2; // CRLF
    }
    
    // Проверяем, не конец ли это
    if (findBytes(dataView, boundaryEndBytes, boundaryIndex) === boundaryIndex) {
      break;
    }
    
    // Находим следующий boundary
    const nextBoundaryIndex = findBytes(dataView, boundaryBytes, partStart);
    if (nextBoundaryIndex === -1) {
      break;
    }
    
    // Извлекаем часть между boundary
    const partData = dataView.slice(partStart, nextBoundaryIndex);
    
    // Парсим заголовки части
    const headerEndIndex = findBytes(partData, new Uint8Array([0x0D, 0x0A, 0x0D, 0x0A]), 0);
    if (headerEndIndex === -1) {
      currentIndex = nextBoundaryIndex;
      continue;
    }
    
    const headersBytes = partData.slice(0, headerEndIndex);
    const bodyBytes = partData.slice(headerEndIndex + 4);
    
    const headersText = new TextDecoder().decode(headersBytes);
    const headers = parseHeaders(headersText);
    
    // Извлекаем имя поля из заголовка Content-Disposition
    const name = extractFieldName(headers['content-disposition'] || '');
    const filename = extractFilename(headers['content-disposition'] || '');
    const contentType = headers['content-type'] || '';
    
    parts.push({
      name,
      data: bodyBytes.buffer,
      type: contentType,
      filename,
    });
    
    currentIndex = nextBoundaryIndex;
  }
  
  return parts;
}

/**
 * Находит позицию байтов в массиве
 */
function findBytes(
  haystack: Uint8Array,
  needle: Uint8Array,
  startIndex: number
): number {
  for (let i = startIndex; i <= haystack.length - needle.length; i++) {
    let match = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return i;
    }
  }
  return -1;
}

/**
 * Парсит заголовки из текста
 */
function parseHeaders(headersText: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const lines = headersText.split(/\r?\n/);
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();
    headers[key] = value;
  }
  
  return headers;
}

/**
 * Извлекает имя поля из Content-Disposition заголовка
 */
function extractFieldName(contentDisposition: string): string {
  const nameMatch = contentDisposition.match(/name="([^"]+)"/);
  return nameMatch ? nameMatch[1] : '';
}

/**
 * Извлекает имя файла из Content-Disposition заголовка
 */
function extractFilename(contentDisposition: string): string | undefined {
  const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
  return filenameMatch ? filenameMatch[1] : undefined;
}