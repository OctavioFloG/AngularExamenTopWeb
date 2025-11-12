import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })  // quita "Bearer " si tu backend no lo usa
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const msg = error.error?.message || error.error?.error || '';
        if (typeof msg === 'string' && /token.*(invalid|expired)/i.test(msg)) {
          auth.logout();
          router.navigateByUrl('/login');
        }
      }
      return throwError(() => error);
    })
  );
};
