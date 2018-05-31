import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Log } from '../model/log';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logUrl = 'api/heroes';
  log = new Log();
  date = new Date();

  constructor(
    private http: HttpClient) {
  }

  clear() {
    this.log.content = [];
  }

  show(message: string) {
    console.log(this.date.toLocaleString() + `【${message}】`);
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      /**
       * 导航到统一错误页面,错误信息如下
       */
      console.error(error.status);
      console.error(error.statusText);
      console.error(error.url);
      console.error(error.ok);
      this.show(`${operation} : ${error.message}`);
      return of(result as T);
    };
  }

}
