import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {User} from '../globalModel/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  /**
   * 注册
   * @param {User} user
   * @returns {Observable<User>}
   */
  register(userFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/user/register`, userFormValue);
  }

  /**
   * 登陆
   * @param userFormValue
   * @returns {Observable<any>}
   */
  login(userFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/user/login`, userFormValue);
  }

  /**
   * 发送验证码到邮箱,验证码类型1表示忘记密码模块
   * @returns {Observable<any>}
   */
  sendEmail(type, receiver): Observable<any> {
    return this.http.get<any>(`/gdd/email/send/${type}/${receiver}`);
  }

  /**
   * 校验邮箱和验证码,校验通过调转到密码修改页面
   *
   * @param {String} type
   * @param {String} email
   * @param {String} code
   */
  checkEmailCode(type, email, code): Observable<any> {
    return this.http.get<any>(`/gdd/email/checkEmailCode/${type}/${email}/${code}`);
  }

  /**
   * 根据邮箱修改密码
   * @param userFormValue
   * @returns {Observable<any>}
   */
  modifyPassword(userFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/user/modifyPassword`, userFormValue);
  }

  /**
   * 跳转到门户网站首页
   * @returns {Observable<any>}
   */
  home(): Observable<any> {
    return this.http.get<any>(`/gdd/user/home`);
  }

  /**
   * 分页查询用户信息
   * @returns {Observable<any>}
   */
  page(itemForPage, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/user/page/${pageNumber}/${pageSize}`, itemForPage);
  }

  /**
   * 删除
   * id="all"表示删除所有
   * id="3b2ebfa1-ed59-4091-a800-aef6e867f1a1,3b2ebfa1-ed59-4091-a800-aef6e867f1a2"表示批量删除
   * @param id
   */
  delete(id): Observable<any> {
    return this.http.post<any>(`/gdd/user/delete`, id);
  }

  /**
   * 修改
   * @param userFormValue
   */
  modify(userFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/user/modify`, userFormValue);
  }

  /**
   * 导出
   * @param itemForPage
   * @returns {Observable<any>}
   */
  export(itemForPage): Observable<any> {
    return this.http.post<any>(`/gdd/file/exportUser`, itemForPage);
  }

  /**
   * 导入
   * @param {FormData} formData
   * @returns {Observable<any>}
   */
  import(formData: FormData): Observable<any> {
    return this.http.post<any>(`/gdd/file/importUser`, formData);
  }


}
