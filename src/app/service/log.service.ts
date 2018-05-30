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
    console.log(this.date.toLocaleString() + `【${message}】`);
  }

  clear() {
    this.log.content = [];
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.show(`${operation} : ${error.message}`);
      return of(result as T);
    };
  }

}
