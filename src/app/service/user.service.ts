import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, retry, tap} from 'rxjs/operators';
import {Md5} from 'ts-md5';

import {User} from '../model/user';
import {LogService} from './log.service';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

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
    userFormValue.hobby = userFormValue.hobby.join(','); // 将hobby数组转化成字符串
    userFormValue.password = Md5.hashStr(userFormValue.password.trim()).toString(); // 对密码进行加密
    userFormValue.rePassword = userFormValue.password;
    return this.http.post<any>(`http://localhost:4200/gdd/user/register`, userFormValue).pipe(
      tap((responseObj) => {
        // 查看Observable中的值,使用那些值做一些事情,并且把它们传出来.这种tap回调不会改变这些值本身
        this.logService.print(`用户注册:${responseObj.msg}`);
      }),
      catchError(this.logService.handleError<any>('用户注册'))
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
    return this.http.post<any>(`http://localhost:4200/gdd/user/login`, userFormValue).pipe(
      tap((responseObj) => {
        this.logService.print(`用户登陆:${responseObj.msg}`);
      }),
      retry(2),
      catchError(this.logService.handleError<any>('用户登陆'))
    );
  }

  /**
   * 发送验证码到邮箱,验证码类型1表示忘记密码模块
   * @returns {Observable<any>}
   */
  sendEmail(type: String, receiver: String): Observable<any> {
    return this.http.get<any>(`http://localhost:4200/gdd/email/send/${type}/${receiver}`).pipe(
      tap((responseObj) => {
        this.logService.print(`忘记密码模块发送邮箱验证码:${responseObj.msg}`);
      }),
      catchError(this.logService.handleError<any>(`忘记密码模块发送邮箱验证码`))
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
      tap((responseObj) => {
        this.logService.print(`忘记密码模块校验邮箱验证码:${responseObj.msg}`);
      }),
      catchError(this.logService.handleError<any>(`忘记密码模块校验邮箱验证码`))
    );
  }

  /**
   * 修改密码
   * @param userFormValue
   * @returns {Observable<any>}
   */
  modifyPassword(userFormValue: any): Observable<any> {
    return this.http.put<any>(`http://localhost:4200/gdd/user/modifyPassword`, userFormValue).pipe(
      tap((responseObj) => {
        this.logService.print(`忘记密码模块修改密码:${responseObj.msg}`);
      }),
      catchError(this.logService.handleError<any>(`忘记密码模块修改密码`))
    );
  }

  /**
   * 跳转到主页
   * @returns {Observable<any>}
   */
  home(): Observable<any> {
    // httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer' + sessionStorage.getItem('jwt'));
    return this.http.get<any>(`http://localhost:4200/gdd/user/home`).pipe(
      tap((responseObj) => {
        this.logService.print(`登陆首页:${responseObj.msg}`);
      }),
      catchError(this.logService.handleError<any>(`登陆首页`))
    );
  }
}
