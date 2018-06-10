import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

/**
 * 全局http拦截器: 监视和转换从应用发送到服务器的 HTTP 请求
 *
 */
@Injectable()
export class GlobalHttpIntercept implements HttpInterceptor {

  /**
   * intercept 方法会把请求转换成一个最终返回 HTTP 响应体的 Observable
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let globalReq = req.clone({setHeaders: {'Content-Type': 'application/json'}});
    const reqUrl = req.url;
    if (reqUrl.includes('/gdd/user/register') || reqUrl.includes('/gdd/user/login')
      || reqUrl.includes('/gdd/email/send') || reqUrl.includes('/gdd/email/checkEmailCode')
      || reqUrl.includes('/gdd/user/modifyPassword')) {// 该类型的请求无需jwt校验
    } else {// 该类型的请求需要jwt校验
      globalReq = globalReq.clone({setHeaders: {'Authorization': 'Bearer' + sessionStorage.getItem('jwt')}});
    }
    /**
     * handle() 方法也会把 HTTP 请求转换成 HttpEvents 组成的 Observable，它最终包含的是来自服务器的响应
     */
    return next.handle(globalReq).pipe(

    );
  }
}
