import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {interpolateParams} from '@angular/animations/browser/src/util';

@Injectable({
  providedIn: 'root'
})
export class CoverService {

  constructor(private http: HttpClient) {
  }

  /**
   * 查询封面类别信息
   * @returns {Observable<any>}
   */
  selectCoverType(): Observable<any> {
    return this.http.get<any>(`/gdd/cover/selectCoverType`);
  }

  /**
   * 修改封面类别信息
   * @param coverTypeFormValue
   */
  modifyCoverType(coverTypeFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/cover/modifyCoverType`, coverTypeFormValue);
  }

  /**
   * 删除封面类别信息
   * @param id
   */
  deleteCoverType(id): Observable<any> {
    return this.http.post<any>(`/gdd/cover/deleteCoverType`, id);
  }

  /**
   * 分页查询封面信息
   * @returns {Observable<any>}
   */
  pageCover(cover, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/cover/pageCover/${pageNumber}/${pageSize}`, cover);
  }

  /**
   * 修改封面信息
   * @param coverFormValue
   */
  modifyCover(coverFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/cover/modifyCover`, coverFormValue.files, {params: {'coverTypeName': coverFormValue.coverTypeName}});
  }

  /**
   * 删除封面信息
   * @param id
   */
  deleteCover(id): Observable<any> {
    return this.http.post<any>(`/gdd/cover/deleteCover`, id);
  }
}
