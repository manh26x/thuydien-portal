import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, finalize, tap} from 'rxjs/operators';
import {
  ApiErrorArgsInvalid,
  ApiErrorForbidden,
  ApiErrorNotFound,
  ApiErrorResponse,
  ApiErrorTokenInvalid
} from './model/error-response';
import { attempt, isError } from 'lodash-es';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private readonly BASE_URL = environment.basePath;
  private readonly IGNORE_URLS = ['/assets/i18n', '/userPortal/exportUserExcel', '/role/exportRoleExcel'];
  private readonly CLIENT_LOG_API = '/common/log';
  private readonly NOT_FOUND_WILL_THROW = [
    '/userPortal/detail'
    , '/news/detail'
    , '/tags/getInfoTag'
    , '/role/detail'
    , '/areaData/detail'
    , '/portal/kpiDashboard'
  ];
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    let httpStatus = 'SUCCESS';
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        this.handleResponse(event, request);
      }, (err: any) => {
        throw err;
      }),
      catchError((err: any) => {
        httpStatus = 'FAIL';
        const error = this.handleError(err, request);
        return throwError(error);
      }),
      finalize(() => {
        if (!environment.production) {
          const elapsed = Date.now() - started;
          const msg = this.getMessageTrace(request, httpStatus, elapsed);
          console[httpStatus === 'FAIL' ? 'error' : 'log'](msg);
        }
      })
    );
  }

  handleResponse(event: any, req: HttpRequest<any>): void {
    if (!(event instanceof HttpResponse)) {
      return;
    }
    const requestUrl = req.url;
    if (!this.isRequestToApi(requestUrl)) {
      return;
    }
    if (this.IGNORE_URLS.find(url => requestUrl.includes(url))) {
      return;
    }
    const { isParseJsonError, response } = this.safeParseJson(event.body);

    if (isParseJsonError) {
      throw new ApiErrorResponse('jsonFormat', 'Cant parse object to json');
    } else {
      if (!response.message || !response.message.code) {
        throw new ApiErrorResponse('noResponseCode', 'Cant get response code');
      }
      const rsCode = response.message.code;
      if (this.isResponseNotFound(response.message)
        && this.NOT_FOUND_WILL_THROW.find(url => requestUrl.includes(url))
      ) {
        throw new ApiErrorNotFound();
      }
      if (!this.isResponseSuccess(response.message)) {
        throw new ApiErrorResponse(rsCode, response.message.message);
      }
    }
  }

  handleError(err: any, req: HttpRequest<any>): void {
    const requestUrl = req.url;
    switch (err.constructor) {
      case HttpErrorResponse: {
        if (requestUrl.includes(this.CLIENT_LOG_API)) {
          break;
        }
        if (err.status === 401) {
          err = new ApiErrorTokenInvalid('tokenInvalid', 'Token expired or invalid');
        } else if (err.status === 403) {
          err = new ApiErrorForbidden('forbidden', 'Not permission to access resource');
        } else if (err.status === 400) {
          err = new ApiErrorArgsInvalid('badRequest', 'Request invalid', err.error);
        }
        break;
      }
      default: {
        of(err).pipe(
          tap(() => this.sendLog(req, err))
        );
        break;
      }
    }
    return err;
  }

  sendLog(req: HttpRequest<any>, err: any): void {
    // TODO: send log to server
  }

  private isRequestToApi(requestUrl: string): boolean {
    return requestUrl.startsWith(this.BASE_URL);

  }

  private safeParseJson(raw: any): { isParseJsonError: boolean, response: any } {
    if (typeof raw === 'object') {
      return { isParseJsonError: false, response: raw };
    } else {
      const response = attempt(JSON.parse, raw);
      return { isParseJsonError: isError(response), response };
    }
  }

  private isResponseSuccess(result: any): boolean {
    return result.code === '200' || result.code === '201';
  }

  private isResponseNotFound(result: any): boolean {
    return result.code === '201';
  }

  private getMessageTrace(req: HttpRequest<any>, status: string, elapsed: number) {
    return `${req.method} "${req.urlWithParams}" ${status} in ${elapsed} ms.`;
  }
}
