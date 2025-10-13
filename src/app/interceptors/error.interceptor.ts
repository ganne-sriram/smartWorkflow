import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        if (error.status === 400 && error.error.errors) {
          const errors = error.error.errors;
          errorMessage = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join(', ');
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.details) {
          errorMessage = error.error.details;
        } else if (error.error.error) {
          errorMessage = error.error.error;
        } else {
          errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }
      
      notificationService.showError(errorMessage);
      
      return throwError(() => error);
    })
  );
};
