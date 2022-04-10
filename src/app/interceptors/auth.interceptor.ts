import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private toastr: ToastrService
    ) { }

  intercept(request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> | Observable<any> {
    return next.handle(this.addAuthToken(request))
      .pipe(
        catchError((requestError: HttpErrorResponse) => {
          if (!this.userService.cachedUserId) {
            return throwError(() => {
              console.log(requestError)
              this.toastr.error(requestError.message)
              new Error(requestError.message)
            });
          }
          if (requestError && requestError.status === 401) {
            return this.userService.refreshTokens()
              .pipe(
                switchMap(tokens => next.handle(this.addAuthToken(request, tokens.accessToken)))
              )
          }

          return throwError(() => {
            this.toastr.error(requestError.message)
            new Error(requestError.message)
          });
        })
      );

  }

  addAuthToken(request: HttpRequest<any>, accessToken: string | undefined = undefined) {
    const token = accessToken || this.userService.cachedAccessToken;

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
