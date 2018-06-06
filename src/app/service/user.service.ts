import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Md5} from 'ts-md5';

import {User} from '../model/user';
import {LogService} from './log.service';
import {Hero} from '../model/hero';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private logService: LogService) {
  }

  /**
   * 用户注册
   * @param {User} user
   * @returns {Observable<User>}
   */
  register(userFormValue: any): Observable<any> {
    // 将hobby数组转化成字符串
    userFormValue.hobby = userFormValue.hobby.join(',');
    // 对密码进行加密
    userFormValue.password = Md5.hashStr(userFormValue.password.trim()).toString();
    userFormValue.rePassword = Md5.hashStr(userFormValue.rePassword.trim()).toString();
    return this.http.post<any>(`http://localhost:4200/gdd/user/register`, userFormValue, httpOptions).pipe(
      tap(_ => this.logService.print(`用户注册`)),
      catchError(this.logService.handleError<any>('register failed'))
    );
  }

  /**
   * 用户登陆
   * @param userFormValue
   * @returns {Observable<any>}
   */
  login(userFormValue: any): Observable<any> {
    // 对密码进行加密
    userFormValue.password = Md5.hashStr(userFormValue.password).toString();
    return this.http.post<any>(`http://localhost:4200/gdd/user/login`, userFormValue, httpOptions).pipe(
      tap(_ => this.logService.print(`login`)),
      catchError(this.logService.handleError<any>('login failed'))
    );
  }

  /**
   * 发送验证码到邮箱,验证码类型1表示忘记密码模块
   * @returns {Observable<any>}
   */
  sendEmail(type: String, receiver: String): Observable<any> {
    return this.http.get<any>(`http://localhost:4200/gdd/email/send/${type}/${receiver}`).pipe(
      tap(_ => this.logService.print(`sendEmail`)),
      catchError(this.logService.handleError<Hero>(`sendEmail failed`))
    );
  }

  /**
   * 校验邮箱和验证码,校验通过调转到密码修改页面
   *
   * @param {String} type
   * @param {String} email
   * @param {String} code
   */
  checkEmailCode(type: String, email: String, code: String): Observable<any> {
    return this.http.get<any>(`http://localhost:4200/gdd/email/checkEmailCode/${type}/${email}/${code}`).pipe(
      tap(_ => this.logService.print(`checkEmailCode`)),
      catchError(this.logService.handleError<Hero>(`checkEmailCode failed`))
    );
  }

  /**
   * 修改密码
   * @param userFormValue
   * @returns {Observable<any>}
   */
  modifyPassword(userFormValue: any): Observable<any> {
    return this.http.put(`http://localhost:4200/gdd/user/modifyPassword`, userFormValue, httpOptions).pipe(
      tap(_ => this.logService.print(`modifyPassword`)),
      catchError(this.logService.handleError<Hero>(`modifyPassword failed`))
    );
  }

  /**
   * 跳转到主页
   * @returns {Observable<any>}
   */
  home(): Observable<any> {
    httpOptions.headers.set('anthorization', 'bearer ' + sessionStorage.getItem('jwt'));
    return this.http.get<any>(`http://localhost:4200/gdd/user/home`, httpOptions).pipe(
      tap(_ => this.logService.print(`home`)),
      catchError(this.logService.handleError<Hero>(`home failed`))
    );
  }
}
