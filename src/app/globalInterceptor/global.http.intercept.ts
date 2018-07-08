import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {LogService} from '../service/log.service';

/**
 * 全局http拦截器: 监视和转换从应用发送到服务器的 HTTP 请求
 * intercept 方法会把请求转换成一个最终返回 HTTP 响应体的 Observable
 * next.handle(globalReq)把 HTTP 请求转换成 HttpEvents 组成的 Observable,它最终包含的是来自服务器的响应
 */
@Injectable()
export class GlobalHttpIntercept implements HttpInterceptor {

  constructor(
    private logService: LogService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let globalReq = req;
    // this.logService.print(`全局HTTP拦截器发起请求${req.url}`);
    if (
      req.url.includes('gdd/user/register') ||
      req.url.includes('gdd/user/login') ||
      req.url.includes('gdd/user/forgetPassword') ||
      req.url.includes('gdd/email/send') ||
      req.url.includes('gdd/email/checkEmailCode') ||
      req.url.includes('gdd/user/modifyPassword')
    ) {
      // console.log(`服务器无需校验jwt`);
      globalReq = globalReq.clone({setHeaders: {'Content-Type': 'application/json'}});
    } else {
      // console.log(`服务器需要校验jwt`);
      globalReq = globalReq.clone({setHeaders: {'Authorization': 'Bearer' + sessionStorage.getItem('jwt')}});
      // 导出操作
      if (req.url.includes('gdd/excel/export')) {
        globalReq = globalReq.clone({setHeaders: {'Content-Type': 'application/json'}});
        globalReq = globalReq.clone({responseType: 'blob'});
      }
      // 导入操作
      if (req.url.includes('gdd/excel/import')) {
        // globalReq = globalReq.clone({reportProgress: true});
        globalReq = globalReq.clone({setHeaders: {'Cache-Control': 'no-cache'}});
      }
    }
    return next.handle(globalReq).pipe(
      // 错误处理
      catchError(this.logService.handleError<any>(`${globalReq.url}请求发生错误`)),
      // 查看响应数据
      tap(event => {
        if (event instanceof HttpResponse) {
          // this.logService.print(`全局HTTP拦截器响应请求${globalReq.url}--状态:${event.statusText},信息:${event.body.msg}`);
        }
      })
    );
  }
}
