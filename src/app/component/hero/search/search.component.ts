import { Component, OnInit } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../../../globalModel/hero';
import { HeroService } from '../../../service/hero.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  /**
   *用来表明 heroes$ 是一个 Observable
   *<li *ngFor="let hero of heroes$ | async" >
   */
  heroes$: Observable<Hero[]>;
  /**
   * Subject 既是可观察对象的数据源，本身也是 Observable。 你可以像订阅任何 Observable 一样订阅 Subject
   * 调用它的 next(value) 方法往 Observable 中推送一些值
   */
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
      // 等待,直到用户停止输入
      debounceTime(300),
      // 等待,直到搜索内容发生了变化
      distinctUntilChanged(),
      // 把搜索请求发送给服务
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
