import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from '../globalModel/hero';
import { LogService } from './log.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  /**
   * providedIn 告诉 Angular，要由根注入器负责创建 HeroService 的实例。
   * 所有用这种方式提供的服务，都会自动在整个应用中可用，而不必把它们显式列在任何模块中
   * 所有被注入的服务依赖都是单例的，也就是说，在任意一个依赖注入器("injector")中，每个服务只有唯一的实例
   */
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private logService: LogService) {
  }

  /**
   * @returns {Observable<Hero[]>}
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(heroes => this.logService.print(`fetched heroes`)),
      // catchError(this.logService.handleError('getHeroes', []))
    );
  }

  /**
   * @param {number} id
   * @returns {Observable<Hero>}
   */
  getHero<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url).pipe(
        map(heroes => heroes[0]),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.logService.print(`${outcome} hero id=${id}`);
        }),
        // catchError(this.logService.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * @param {Hero} hero
   * @returns {Observable<any>}
   */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.logService.print(`updated hero id=${hero.id}`)),
      // catchError(this.logService.handleError<any>('updateHero'))
    );
  }

  /**
   * @param {Hero | number} hero
   * @returns {Observable<Hero>}
   */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.logService.print(`deleted hero id=${id}`)),
      // catchError(this.logService.handleError<Hero>('deleteHero'))
    );
  }

  /**
   * @param {Hero} hero
   * @returns {Observable<Hero>}
   */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((item: Hero) => this.logService.print(`added hero id=${item.id}`)),
      // catchError(this.logService.handleError<Hero>('addHero'))
    );
  }

  /**
   * @param {string} term
   * @returns {Observable<Hero[]>}
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.logService.print(`found heroes matching "${term}"`)),
      // catchError(this.logService.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
