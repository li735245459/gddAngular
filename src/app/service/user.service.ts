import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Md5} from 'ts-md5';

import { User } from '../model/user';
import { LogService } from './log.service';


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
  register(user: any): Observable<any> {
    // 将hobby数组转化成字符串
    user.hobby = user.hobby.join(',');
    // 对密码进行加密
    console.log(user);
    user.password = Md5.hashStr(user.password).toString();
    user.rePassword = Md5.hashStr(user.rePassword).toString();
    return this.http.post<any>(`http://localhost:4200/gdd/user/register`, user, httpOptions).pipe(
      tap(_ => this.logService.show(`register success`)),
      catchError(this.logService.handleError<any>('register failed'))
    );
  }

  login(user: any): Observable<any> {
    // 对密码进行加密
    console.log(user);
    user.password = Md5.hashStr(user.password).toString();
    return this.http.post<any>(`http://localhost:4200/gdd/user/login`, user, httpOptions).pipe(
      tap(_ => this.logService.show(`login success`)),
      catchError(this.logService.handleError<any>('login failed'))
    );
  }
}
