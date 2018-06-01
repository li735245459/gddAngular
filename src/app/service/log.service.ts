import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {Log} from '../model/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  log = new Log();
  date = new Date();

  constructor() {
  }

  clear() {
    this.log.content = [];
  }

  print(message: string) {
    console.log(this.date.toLocaleString() + ` 当前操作--${message}`);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(error);
      // console.error(error.status); // 0
      // console.error(error.statusText); // Unknown Error
      // console.error(error.url); // null
      // console.error(error.ok); // false
      // console.error(error.message); // Http failure response for (unknown url): 0 Unknown Error
      this.print(`${operation} : ${error.message}`);
      return of(result as T);
    };
  }

}
