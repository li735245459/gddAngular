import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Md5} from 'ts-md5';

import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient) {
  }

  /**
   * 用户注册
   * @param {User} user
   * @returns {Observable<User>}
   */
  register(userFormValue: any): Observable<any> {
    userFormValue.hobby = userFormValue.hobby.join(','); // 将hobby数组转化成字符串
    // console.log(`加密前:${userFormValue.password}`);
    userFormValue.password = Md5.hashStr(userFormValue.password.trim()).toString(); // 对密码进行加密
    userFormValue.rePassword = userFormValue.password;
    // console.log(`加密后:${userFormValue.password}`);
    return this.http.post<any>(`/gdd/user/register`, userFormValue);
  }

  /**
   * 用户登陆
   * @param userFormValue
   * @returns {Observable<any>}
   */
  login(userFormValue: any): Observable<any> {
    // 对密码进行加密
    // console.log(`加密前:${userFormValue.password}`);
    userFormValue.password = Md5.hashStr(userFormValue.password).toString();
    // console.log(`加密后:${userFormValue.password}`);
    return this.http.post<any>(`/gdd/user/login`, userFormValue);
  }

  /**
   * 发送验证码到邮箱,验证码类型1表示忘记密码模块
   * @returns {Observable<any>}
   */
  sendEmail(type: String, receiver: String): Observable<any> {
    return this.http.get<any>(`/gdd/email/send/${type}/${receiver}`);
  }

  /**
   * 校验邮箱和验证码,校验通过调转到密码修改页面
   *
   * @param {String} type
   * @param {String} email
   * @param {String} code
   */
  checkEmailCode(type: String, email: String, code: String): Observable<any> {
    return this.http.get<any>(`/gdd/email/checkEmailCode/${type}/${email}/${code}`);
  }

  /**
   * 修改密码
   * @param userFormValue
   * @returns {Observable<any>}
   */
  modifyPassword(userFormValue: any): Observable<any> {
    return this.http.post<any>(`/gdd/user/modifyPassword`, userFormValue);
  }

  /**
   * 跳转到主页
   * @returns {Observable<any>}
   */
  home(): Observable<any> {
    return this.http.get<any>(`/gdd/user/home`);
  }
}
