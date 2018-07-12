import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoverService {

  constructor(private http: HttpClient) { }

  /**
   * 分页查询封面类别信息
   * @returns {Observable<any>}
   */
  pageByCoverType(coverType, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/cover/pageByCoverType/${pageNumber}/${pageSize}`, coverType);
  }

  /**
   * 分页查询封面信息
   * @returns {Observable<any>}
   */
  pageByCover(cover, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/cover/pageByCover/${pageNumber}/${pageSize}`, cover);
  }

  /**
   * 修改封面类别信息
   * @param coverTypeFormValue
   */
  modifyByCoverType(coverTypeFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/cover/modifyByCoverType`, coverTypeFormValue);
  }

  /**
   * 修改封面信息
   * @param coverFormValue
   */
  modifyByCover(coverFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/cover/modifyByCover`, coverFormValue);
  }

  /**
   * 删除封面类别信息
   * @param id
   */
  deleteByCoverType(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteByGoodsType`, id);
  }

  /**
   * 删除封面信息
   * @param id
   */
  deleteByCover(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteByGoods`, id);
  }
}
