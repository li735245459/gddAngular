import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';

import {Log} from '../model/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  log = new Log();
  date = new Date();

  constructor(private router: Router) {
  }

  clear() {
    this.log.content = [];
  }

  print(message: string) {
    console.log(this.date.toLocaleString() + ` 当前操作--${message}`);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // this.print(`${operation} : ${error.message}`);
      console.error(`status:${error.status}`);
      console.error(`statusText:${error.statusText}`); // Unknown Error
      console.error(`url:${error.url}`);
      console.error(`ok:${error.ok}`);
      console.error(`message:${error.message}`);
      const errorMag = error.statusText + ':' + error.status;
      this.router.navigateByUrl(`error/${errorMag}`);
      return of(result as T);
    };
  }

}
