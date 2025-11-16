import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Router, ActivationEnd } from '@angular/router';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { HttpCancelService } from './http-cancel.service';
import { Store } from '@ngrx/store';
import { requestCancelledAction } from './admin/store/actions/requestCancelled.action';

@Injectable()
export class ManageHttpInterceptor implements HttpInterceptor {
  constructor(
    router: Router,
    private httpCancelService: HttpCancelService,
    private store: Store
  ) {
    router.events.subscribe((event) => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ActivationEnd) {
        // Cancel pending calls
        this.httpCancelService.cancelPendingRequests();
      }
    });
  }

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    let requestCancelled = false;

    return next.handle(req).pipe(
      takeUntil(
        this.httpCancelService.onCancelPendingRequests().pipe(
          finalize(() => {
            requestCancelled = true;
            console.log('""""""""Request cancelled by takeUntil: ', req.url);
            if (this.isAdminRequest(req.url)) {
              this.httpCancelService.incrementCancelledRequests();
              this.store.dispatch(requestCancelledAction());
            }
          })
        )
      ),
      catchError((error) => {
        // Проверяем, является ли это админским запросом и был ли он отменён
        if (this.isAdminRequest(req.url) && this.isRequestCancelled(error)) {
          // Увеличиваем счетчик отменённых запросов
          this.httpCancelService.incrementCancelledRequests();
          // Отправляем action для уменьшения счетчика
          this.store.dispatch(requestCancelledAction());
        }
        throw error; // Пробрасываем ошибку дальше
      }),
      finalize(() => {
        if (requestCancelled) {
          console.log(
            '""""""""Request completed after cancellation: ',
            req.url
          );
        }
      })
    );
  }

  private isAdminRequest(url: string): boolean {
    return url.includes('/admin/');
  }

  private isRequestCancelled(error: any): boolean {
    return (
      error.name === 'AbortError' ||
      error.status === 0 ||
      error.statusText === 'Unknown Error' ||
      (error.error && error.error.type === 'abort')
    );
  }
}
