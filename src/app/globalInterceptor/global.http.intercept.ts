import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {LogService} from '../service/log.service';

/**
 * 全局http请求拦截器: 监视和转换从应用发送到服务器的 HTTP 请求
 */
@Injectable()
export class GlobalHttpIntercept implements HttpInterceptor {

  constructor(
    private logService: LogService) {
  }

  /*intercept 方法会把请求转换成一个最终返回 HTTP 响应体的 Observable*/
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let globalReq = req;
    if (
      req.url.includes('gdd/user/register') || // 注册请求
      req.url.includes('gdd/user/login') || // 登陆请求
      req.url.includes('gdd/user/forgetPassword') || // 忘记密码请求
      req.url.includes('gdd/email/send') || // 发送验证码请求
      req.url.includes('gdd/email/checkEmailCode') || // 校验验证码请求
      req.url.includes('gdd/user/modifyPassword') || // 修改密码请求
      req.url.includes('gdd/index') // 门户网站首页请求
    ) {
      // 无需登陆即可访问---------------------------------------------------------->
    } else {
      // 登陆后才可以访问---------------------------------------------------------->
      const jwt = sessionStorage.getItem('jwt'); // 获取本地jwt
      if (jwt) {
        globalReq = globalReq.clone({setHeaders: {'Authorization': 'Bearer' + jwt}}); // 设置请求头内容-jwt
        /*全局【导出文件】请求拦截*/
        if (req.url.includes('gdd/file/export')) {
          globalReq = globalReq.clone({responseType: 'blob'}); // 指定服务器响应的类型(arraybuffer,blob,document,json,text)
          globalReq = globalReq.clone({reportProgress: true}); // 跟踪文件下载进度
        }
        /*全局【导入文件】请求拦截*/
        if (req.url.includes('gdd/file/import')) {
          globalReq = globalReq.clone({reportProgress: true}); // 跟踪文件上传进度
        }
      }
    }
    /*next.handle(globalReq)把 HTTP 请求转换成 HttpEvents 组成的 Observable,它最终包含的是来自服务器的响应*/
    return next.handle(globalReq).pipe(
      catchError(this.logService.handleError<any>(`${globalReq.url}请求出错: `)), // 错误处理
      tap(event => { // 请求成功后响应数据
        if (event instanceof HttpResponse) {
          // this.logService.print(`${globalReq.url}请求成功: ${event.statusText},信息: ${event.body.msg}`);
        }
      })
    );
  }
}
