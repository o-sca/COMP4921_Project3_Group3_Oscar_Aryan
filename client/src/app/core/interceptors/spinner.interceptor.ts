import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

export const spinnerInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const spinnerService = inject(SpinnerService);

  spinnerService.show();

  return next(req).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          spinnerService.hide();
        }
      },
      error: () => {
        spinnerService.hide();
      },
    }),
  );
};
