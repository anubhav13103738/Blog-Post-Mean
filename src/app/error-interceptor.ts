import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private matDialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMesaage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMesaage = error.error.message;
        }
        // console.log(error);
        // alert(error.error.message);
        this.matDialog.open(ErrorComponent, {
          data: { message: errorMesaage },
        });
        return throwError(error);
      })
    );
  }
}
