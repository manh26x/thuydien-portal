import { Injectable } from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Language} from '../core/model/language.enum';
import {Observable} from 'rxjs';
import {RoleEnum} from '../shared/model/role';
import {FeatureGroupByRole, UserAuth, UserRole} from './model/user-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient;
  public readonly TOKEN_KEY = 'token';
  public readonly REFRESH_TOKEN_KEY = 'refresh-token';
  private readonly USER_INFO_KEY = 'user-info';
  private readonly USER_ROLE_KEY = 'user-role';

  constructor(
    private handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
  }

  /**
   * login user
   * @param value login object username and password
   */
  login(value): Observable<any> {
    const body = new HttpParams()
      .append('username', value.username.toLowerCase())
      .append('password', value.password)
      .append('grant_type', 'password');
    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', `Basic ${environment.clientId}`);
    return this.http.post(`${environment.baseUrl}${environment.basePath}/uaa/oauth/token`, body, {
      headers: header
    });
  }

  logOut() {
    const currentLang = localStorage.getItem(Language.LOCAL_KEY);
    this.deleteCookie(this.TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    localStorage.clear();
    localStorage.setItem(Language.LOCAL_KEY, currentLang);
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
    return this.http.post(`${environment.baseUrl}${environment.basePath}/uaa/oauth/token`, body, {
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

  getUserInfo(): UserAuth {
    const data = localStorage.getItem(this.USER_INFO_KEY);
    const jsonData = JSON.parse(data);
    return { userName: jsonData.userName, role: jsonData.role, isSupperAdmin: jsonData.role === RoleEnum.SUPPER_ADMIN };
  }

  /**
   * set token to auth with api
   * @param token token value
   */
  setToken(token, expireIn) {
    this.deleteCookie(this.TOKEN_KEY);
    this.setCookie(this.TOKEN_KEY, token, expireIn);
  }

  /**
   * set refresh token to auth api
   * @param token refresh token value
   */
  setRefreshToken(token) {
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.setCookie(this.REFRESH_TOKEN_KEY, token, environment.refreshTokenEx);
  }

  setUserInfo(user) {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(user));
  }

  setUserRole(roleList) {
    localStorage.setItem(this.USER_ROLE_KEY, JSON.stringify(roleList));
  }

  getUserRole(): FeatureGroupByRole {
    const data = localStorage.getItem(this.USER_ROLE_KEY);
    const jsonData = JSON.parse(data);
    return jsonData;
  }

  isHasRole(feature: string, role: string): boolean {
    const featureList: FeatureGroupByRole = this.getUserRole();
    const roleList: UserRole[] = featureList[feature];
    return roleList && !!roleList.find(x => x.rightId === role);
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
