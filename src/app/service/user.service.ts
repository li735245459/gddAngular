import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../model/user';
import { LogService } from './log.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private logService: LogService) { }

  register(user: User): Observable<any> {
    return this.http.post<any>(`http://localhost:4200/gdd/user/register`, user, httpOptions).pipe(
      tap(_ => this.logService.show(`register`)),
      catchError(this.logService.handleError<any>('register'))
    );
  }
}
