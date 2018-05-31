import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Md5} from 'ts-md5';

import { User } from '../model/user';
import { LogService } from './log.service';
import {Hero} from '../model/hero';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private logService: LogService) { }

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
      tap(_ => this.logService.show(`register`)),
      catchError(this.logService.handleError<any>('register failed'))
    );
  }

  login(userFormValue: any): Observable<any> {
    // 对密码进行加密
    userFormValue.password = Md5.hashStr(userFormValue.password).toString();
    return this.http.post<any>(`http://localhost:4200/gdd/user/login`, userFormValue, httpOptions).pipe(
      tap(_ => this.logService.show(`login`)),
      catchError(this.logService.handleError<any>('login failed'))
    );
  }

  /**
   * 发送邮件 `${this.heroesUrl}/?id=${id}`
   * @returns {Observable<any>}
   */
  sendEmail(type: String, receiver: String, ): Observable<any> {
    return this.http.get<any>(`http://localhost:4200/gdd/user/sendEmail/${type}/${receiver}`).pipe(
      tap(_ => this.logService.show(`sendEmail`)),
      catchError(this.logService.handleError<Hero>(`sendEmail failed`))
    );
  }
}
