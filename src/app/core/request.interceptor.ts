import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {timeout} from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private readonly BASE_URL = environment.basePath;
  private readonly IGNORE_URLS = [];
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(this.BASE_URL) && !this.IGNORE_URLS.find(u => req.url.includes(u))) {
      if (this.authService.isAuthed()) {
        req = this.updateHeader(req);
      }
    }
    return next.handle(req).pipe(timeout(10000));
  }

  private updateHeader(req: HttpRequest<any>) {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    });
    return req;
  }

}
