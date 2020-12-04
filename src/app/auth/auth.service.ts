import { Injectable } from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient;
  public readonly TOKEN_KEY = 'token';
  public readonly REFRESH_TOKEN_KEY = 'refresh-token';

  constructor(
    private handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
  }

  /**
   * login user
   * @param value login object username and password
   */
  login(value) {
    const body = new HttpParams()
      .append('username', value.username)
      .append('password', value.password)
      .append('grant_type', 'password');
    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', `Basic ${environment.clientId}`);
    return this.http.post(`${environment.baseUrl}${environment.basePath}/oauth/token`, body, {
      headers: header
    });
  }

  logOut() {
    const currentLang = localStorage.getItem('lang');
    this.deleteCookie(this.TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    localStorage.clear();
    localStorage.setItem('lang', currentLang);
  }

  /**
   * refresh token
   */
  refreshToken() {
    const body = new HttpParams()
      .append('refresh_token', this.getCookie(this.REFRESH_TOKEN_KEY))
      .append('grant_type', 'refresh_token');
    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', `Basic ${environment.clientId}`);
    return this.http.post(`${environment.baseUrl}${environment.basePath}/oauth/token`, body, {
      headers: header
    });
  }

  /**
   * check user logged in
   */
  isAuthed() {
    return this.getCookie(this.TOKEN_KEY) !== '' || this.getCookie(this.REFRESH_TOKEN_KEY) !== '';
  }

  getToken() {
    return this.getCookie(this.TOKEN_KEY);
  }

  getRefreshToken() {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }

  /**
   * set token to auth with api
   * @param token token value
   */
  setToken(token) {
    this.deleteCookie(this.TOKEN_KEY);
    this.setCookie(this.TOKEN_KEY, token, environment.tokenEx);
  }

  /**
   * set refresh token to auth api
   * @param token refresh token value
   */
  setRefreshToken(token) {
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.setCookie(this.REFRESH_TOKEN_KEY, token, environment.refreshTokenEx);
  }

  // cookie utils docs https://www.w3schools.com/js/js_cookies.asp
  private setCookie(cname, cvalue, seconds) {
    const d = new Date();
    d.setTime(d.getTime() + (seconds * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  private getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  private deleteCookie(cname) {
    const cvalue = this.getCookie(cname);
    if (cvalue !== '') {
      document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }
}
