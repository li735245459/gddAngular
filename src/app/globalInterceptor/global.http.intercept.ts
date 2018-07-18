import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {LogService} from '../service/log.service';

/**
 * 全局http拦截器: 监视和转换从应用发送到服务器的 HTTP 请求
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
      req.url.includes('gdd/user/register') ||
      req.url.includes('gdd/user/login') ||
      req.url.includes('gdd/user/forgetPassword') ||
      req.url.includes('gdd/email/send') ||
      req.url.includes('gdd/email/checkEmailCode') ||
      req.url.includes('gdd/user/modifyPassword')
    ) {
      // 服务器无需校验jwt---------------------------------------------------------->
      globalReq = globalReq.clone({setHeaders: {'Content-Type': 'application/json'}});
    } else {
      // 服务器需要校验jwt---------------------------------------------------------->
      const jwt = sessionStorage.getItem('jwt');
      if (jwt) {
        globalReq = globalReq.clone({setHeaders: {'Authorization': 'Bearer' + jwt}});
        /*全局【导出】请求拦截*/
        if (req.url.includes('gdd/excel/export')) {
          globalReq = globalReq.clone({setHeaders: {'Content-Type': 'application/json'}});
          globalReq = globalReq.clone({responseType: 'blob'});
        }
        /*全局【导入】请求拦截*/
      }
    }
    /*next.handle(globalReq)把 HTTP 请求转换成 HttpEvents 组成的 Observable,它最终包含的是来自服务器的响应*/
    return next.handle(globalReq).pipe(
      /*错误处理*/
      catchError(this.logService.handleError<any>(`${globalReq.url}请求发生错误`)),
      /*查看响应数据*/
      tap(event => {
        if (event instanceof HttpResponse) {
          // this.logService.print(`全局HTTP拦截器响应请求${globalReq.url}--状态:${event.statusText},信息:${event.body.msg}`);
        }
      })
    );
  }
}
