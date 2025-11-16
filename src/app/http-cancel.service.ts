import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class HttpCancelService {
  private pendingHTTPRequests$ = new Subject<void>();
  private cancelledRequestsCount = 0;

  constructor() {}

  // Cancel Pending HTTP calls
  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
    this.cancelledRequestsCount = 0; // Сбрасываем счетчик при новой отмене
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  // Увеличиваем счетчик отменённых запросов
  public incrementCancelledRequests() {
    this.cancelledRequestsCount++;
  }

  // Получаем количество отменённых запросов
  public getCancelledRequestsCount(): number {
    return this.cancelledRequestsCount;
  }

  // Сбрасываем счетчик отменённых запросов
  public resetCancelledRequestsCount() {
    this.cancelledRequestsCount = 0;
  }
}
