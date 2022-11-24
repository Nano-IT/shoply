import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth.service';
import { TokensInterface } from '@/ts/interfaces';
import { ApiRoutes } from '@/ts/enum';
import {
  AUTHORIZATION_HEADER_KEY,
  AUTHORIZATION_HEADER_PREFIX,
} from '@/ts/consts';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  isRefreshing: boolean = false;

  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.auth.refreshToken) {
      return next.handle(request);
    }

    return next
      .handle(request)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.catchHttpError(err, request, next)
        )
      );
  }

  private catchHttpError(
    err: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      err.status === HttpStatusCode.Unauthorized &&
      request.url !== ApiRoutes.Login &&
      !this.isRefreshing
    ) {
      this.isRefreshing = true;
      this.auth.setAccessToken(null);

      return this.auth.refresh().pipe(
        switchMap(({ accessToken }: TokensInterface) => {
          this.isRefreshing = false;
          return next.handle(
            request.clone({
              headers: request.headers.set(
                AUTHORIZATION_HEADER_KEY,
                `${AUTHORIZATION_HEADER_PREFIX} ${accessToken}`
              ),
            })
          );
        })
      );
    }

    return throwError(() => err);
  }
}

export const REFRESH_TOKEN_INTERCEPTOR_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: RefreshTokenInterceptor,
  multi: true,
};
