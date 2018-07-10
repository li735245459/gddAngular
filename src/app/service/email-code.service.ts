import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailCodeService {

  constructor(private http: HttpClient) {
  }

  /**
   * 分页查询用户信息
   * @returns {Observable<any>}
   */
  page(emailCode, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/email/page/${pageNumber}/${pageSize}`, emailCode);
  }

  /**
   * 删除
   * id="all"表示删除所有
   * id="3b2ebfa1-ed59-4091-a800-aef6e867f1a1,3b2ebfa1-ed59-4091-a800-aef6e867f1a2"表示批量删除
   * @param id
   */
  delete(id): Observable<any> {
    return this.http.post<any>(`/gdd/email/delete`, id);
  }
}
