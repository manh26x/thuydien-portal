import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
// import {timeout} from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private readonly BASE_URL = environment.basePath;
  // url not required auth
  private readonly IGNORE_URLS = [];
  // url use import export timeout in environment, otherwise use client timeout
  //  private readonly IMPORT_EXPORT_URLS = [
  //    '/userPortal/exportUserExcel',
  //    '/userPortal/readUserWithExcel',
  //    '/portal/importKPI',
  //    '/role/exportRoleExcel'
  //  ];
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(this.BASE_URL) && !this.IGNORE_URLS.find(u => req.url.includes(u))) {
      if (this.authService.isAuthed()) {
        req = this.updateHeader(req);
      }
    }
    // const rqTimeout = this.IMPORT_EXPORT_URLS.find(u => req.url.includes(u)) ?
    // environment.importExportTimeout : environment.clientTimeout;
    return next.handle(req);
    //    .pipe(
    //      timeout(rqTimeout)
    //    );
  }

  private updateHeader(req: HttpRequest<any>) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    });
    return req;
  }

}
