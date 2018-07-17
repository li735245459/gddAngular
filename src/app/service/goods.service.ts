import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(private http: HttpClient) { }

  /**
   * 查询封面类别信息
   * @returns {Observable<any>}
   */
  findGoodsType(): Observable<any> {
    return this.http.get<any>(`/gdd/goods/findGoodsType`);
  }

  /**
   * 修改封面类别信息
   * @param coverTypeFormValue
   */
  modifyGoodsType(coverTypeFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/goods/modifyGoodsType`, coverTypeFormValue);
  }

  /**
   * 删除封面类别信息
   * @param id
   */
  deleteGoodsType(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteGoodsType`, id);
  }
}
