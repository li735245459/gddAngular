import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {LogService} from '../service/log.service';

/**
 * 全局http拦截器: 监视和转换从应用发送到服务器的 HTTP 请求
 *
 */
@Injectable()
export class GlobalHttpIntercept implements HttpInterceptor {

  constructor(
    private logService: LogService) {
  }

  /**
   * intercept 方法会把请求转换成一个最终返回 HTTP 响应体的 Observable
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let globalReq = req.clone({setHeaders: {'Content-Type': 'application/json'}});
    // this.logService.print(`全局HTTP拦截器发起请求${req.url}`);
    if (
      req.url.includes('gdd/user/register') ||
      req.url.includes('gdd/user/login') ||
      req.url.includes('gdd/user/forgetPassword') ||
      req.url.includes('gdd/email/send') ||
      req.url.includes('gdd/email/checkEmailCode') ||
      req.url.includes('gdd/user/modifyPassword')
    ) {
      // console.log(`该类型的请求无需远程校验jwt`);
    } else {
      // console.log(`该类型的请求需要远程校验jwt`);
      if (req.url.includes('gdd/excel/export')) {
        // globalReq.detectContentTypeHeader();
        // globalReq = globalReq.clone({setHeaders: {'responseType': 'arraybuffer'}}); // 否则下载的excel会乱码
        // globalReq = globalReq.clone({setHeaders: {'Content-Type': 'application/vnd.ms-excel'}});
      }
      globalReq = globalReq.clone({setHeaders: {'Authorization': 'Bearer' + sessionStorage.getItem('jwt')}});
    }
    /**
     * handle() 方法也会把 HTTP 请求转换成 HttpEvents 组成的 Observable，它最终包含的是来自服务器的响应
     */
    return next.handle(globalReq).pipe(
      catchError(this.logService.handleError<any>(`${globalReq.url}请求发生错误`)), // 错误处理
      tap(event => { // 查看响应数据
        if (event instanceof HttpResponse) {
          // this.logService.print(`全局HTTP拦截器响应请求${globalReq.url}--状态:${event.statusText},信息:${event.body.msg}`);
        }
      })
    );
  }
}
