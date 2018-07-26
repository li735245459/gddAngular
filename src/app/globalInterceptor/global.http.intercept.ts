import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MessagerService} from 'ng-easyui/components/messager/messager.service';

import {LogService} from '../service/log.service';

/**
 * 全局http请求拦截器: 监视和转换从应用发送到服务器的 HTTP 请求
 */
@Injectable()
export class GlobalHttpIntercept implements HttpInterceptor {

  constructor(
    private logService: LogService,
    private router: Router,
    private messagerService: MessagerService) {
  }

  /*
    intercept 方法会把请求转换成一个最终返回 HTTP 响应体的 Observable
  */
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
        // 全局【下载文件】请求拦截
        if (req.url.includes('gdd/file/export')) {
          globalReq = globalReq.clone({responseType: 'blob'}); // 指定服务器响应的类型(arraybuffer,blob,document,json,text)
          // globalReq = globalReq.clone({reportProgress: true}); // 跟踪文件下载进度
        }
        // 全局【上传文件】请求拦截
        if (req.url.includes('gdd/file/import')) {
          globalReq = globalReq.clone({reportProgress: true}); // 跟踪文件上传进度
        }
      }
    }
    /*
      next.handle(globalReq)把 HTTP 请求转换成 HttpEvents 组成的 Observable,它最终包含的是来自服务器的响应
    */
    return next.handle(globalReq).pipe(
      // 异常捕获
      catchError(this.logService.handleError<any>(`${globalReq.url}请求出错: `)),
      // 探查响应数据
      tap(event => {
        if (event instanceof HttpResponse) { // 请求响应成功（已接收全部响应,包含响应体）
          if (event.body instanceof Blob) {
            // 打印日志
            this.logService.print(`${globalReq.url}请求成功: ${event.statusText},信息: 文件下载`);
          } else if (event.body.code === 0) {
            // 打印日志
            this.logService.print(`${globalReq.url}请求成功: ${event.statusText},信息: ${event.body.msg}`);
          } else if (event.body.code === 1000) {
            // 服务器解析jwt出错,需要重新登陆
            this.messagerService.confirm({
              title: '温馨提示', msg: '登陆超时,请重新登陆', ok: '确定', cancel: '取消',
              result: (r) => {
                if (r) {
                  setTimeout(() => {
                    this.router.navigateByUrl('/login');
                  }, 500);
                }
              }
            });
          } else {
            // 系统出错
            this.messagerService.alert({title: '温馨提示', msg: event.body.msg, ok: '确定'});
          }
        }
      }),
      // 出口
      finalize(() => {})
    );
  }
}
