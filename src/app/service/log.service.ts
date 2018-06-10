import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  date = new Date();
  msg: string;

  constructor(private router: Router) {
  }

  print(message: string) {
    const nowDateTime = this.date.toLocaleString();
    console.log(`【${nowDateTime}】-【${message}】`);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(`status:${error.status}`);
      // console.error(`statusText:${error.statusText}`);
      // console.error(`url:${error.url}`);
      // console.error(`ok:${error.ok}`);
      // console.error(`message:${error.message}`);
      switch (error.status) {
        case 0:
          this.msg = `服务器连接断开`;
          break;
        case 403:
          this.msg = `服务器拒绝访问`;
          break;
        case 404:
          this.msg = `访问的页面不存在`;
          break;
        case 500:
          this.msg = `服务器系统错误`;
          break;
        default:
          this.msg = `未知错误`;
      }
      this.router.navigateByUrl(`error/${this.msg}`);
      return of(result as T);
    };
  }

}
