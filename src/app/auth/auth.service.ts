import { Injectable } from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Language} from '../core/model/language.enum';
import {Observable} from 'rxjs';
import {RoleEnum} from '../shared/model/role';
import {FeatureGroupByRole, UserAuth, UserRole} from './model/user-auth';
// import {ApiResultResponse} from '../core/model/result-response';

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

  logOut(): void {
    const header = new HttpHeaders().append('Authorization', `Bearer ${this.getToken()}`);
    this.http.get(`${environment.baseUrl}${environment.basePath}/uaa/user/logOut`, { headers: header }).subscribe();
    const currentLang = localStorage.getItem(Language.LOCAL_KEY);
    this.deleteCookie(this.TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    localStorage.clear();
    localStorage.setItem(Language.LOCAL_KEY, currentLang);
  }

  /**
   * refresh token
   */
  refreshToken(): Observable<any> {
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

  /* checkUserPortal(token: string): Observable<ApiResultResponse> {
    const header = new HttpHeaders().append('Authorization', `Bearer ${token}`);
    return this.http.get<ApiResultResponse>(`${environment.baseUrl}${environment.basePath}/uaa/user/checkPortalUser`, { headers: header });
  }

  checkUserActive(token: string): Observable<ApiResultResponse> {
    const header = new HttpHeaders().append('Authorization', `Bearer ${token}`);
    return this.http.get<ApiResultResponse>(`${environment.baseUrl}${environment.basePath}/uaa/user/checkActive`, { headers: header });
  } */

  /**
   * check user logged in
   */
  isAuthed(): boolean {
    return this.getCookie(this.TOKEN_KEY) !== '' || this.getCookie(this.REFRESH_TOKEN_KEY) !== '';
  }

  getToken(): string {
    return this.getCookie(this.TOKEN_KEY);
  }

  getRefreshToken(): string {
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
   * @param expireIn time expire token: seconds
   */
  setToken(token, expireIn): void {
    this.deleteCookie(this.TOKEN_KEY);
    this.setCookie(this.TOKEN_KEY, token, expireIn);
  }

  /**
   * set refresh token to auth api
   * @param token refresh token value
   */
  setRefreshToken(token): void {
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.setCookie(this.REFRESH_TOKEN_KEY, token, environment.refreshTokenEx);
  }

  setUserInfo(user): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(user));
  }

  setUserRole(roleList): void {
    localStorage.setItem(this.USER_ROLE_KEY, JSON.stringify(roleList));
  }

  getUserRole(): FeatureGroupByRole {
    const data = localStorage.getItem(this.USER_ROLE_KEY);
    return JSON.parse(data);
  }

  isHasRole(feature: string, role: string): boolean {
    const featureList: FeatureGroupByRole = this.getUserRole();
    const roleList: UserRole[] = featureList[feature];
    return roleList && !!roleList.find(x => x.rightId === role);
  }
<<<<<<< HEAD
=======
  isHasApproved(feature: string,  role: string) {
    const featureList: FeatureGroupByRole = this.getUserRole();
    const roleList: UserRole[] = featureList[feature];
    return roleList && !!roleList.find(x => x.rightId === role);
  }
>>>>>>> 74e9aadc5c648ed2a84ace0183a7ecb14c49a597

  // cookie utils docs https://www.w3schools.com/js/js_cookies.asp
  private setCookie(cname, cvalue, seconds): void {
    const d = new Date();
    d.setTime(d.getTime() + (seconds * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  private getCookie(cname): string {
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

  private deleteCookie(cname): void {
    const cvalue = this.getCookie(cname);
    if (cvalue !== '') {
      document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }
<<<<<<< HEAD
=======


>>>>>>> 74e9aadc5c648ed2a84ace0183a7ecb14c49a597
}
