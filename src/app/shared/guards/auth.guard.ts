import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isLoggedInSelector, isLoadingSelector } from 'src/app/auth/store/selectors';
import { Store, select } from '@ngrx/store';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { getCurrentUserAction } from 'src/app/auth/store/actions/getCurrentUser.action';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public isLoggedIn$: Observable<boolean | null>;
  public isLoading$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Сохраняем URL, на который хотел перейти пользователь
    const targetUrl = state.url;
    
    // Проверяем статус авторизации
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector));
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    
    // Вместо немедленного перенаправления на страницу логина, 
    // дожидаемся завершения проверки авторизации
    return this.isLoggedIn$.pipe(
      take(1),
      switchMap(isLogged => {
        // Если isLogged === null, значит авторизация еще не проверена,
        // отправляем запрос на получение текущего пользователя
        if (isLogged === null) {
          this.store.dispatch(getCurrentUserAction());
          
          // Ждем, пока не получим четкий ответ об авторизации (true или false)
          return this.isLoggedIn$.pipe(
            filter(status => status !== null),
            take(1)
          );
        }
        
        // Если уже есть статус авторизации, просто возвращаем его
        return this.isLoggedIn$.pipe(take(1));
      }),
      map(isLogged => {
        if (!isLogged) {
          // Если пользователь не авторизован, сохраняем целевой URL и перенаправляем на страницу логина
          if (targetUrl && targetUrl !== '/' && targetUrl !== '/auth/login') {
            localStorage.setItem('redirectUrl', targetUrl);
          }
          
          // Редирект на страницу логина
          this.router.navigateByUrl('/auth/login');
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
