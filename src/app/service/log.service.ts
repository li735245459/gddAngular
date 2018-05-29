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

  show(message: string) {
    // this.log.content.push(this.date.toLocaleString() + `【${message}】`);
    console.log(this.date.toLocaleString() + `【${message}】`);
  }

  clear() {
    this.log.content = [];
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(error); // log to console instead
      this.show(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
