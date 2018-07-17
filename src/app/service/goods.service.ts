import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(private http: HttpClient) { }

  /**
   * 查询商品类别信息
   * @returns {Observable<any>}
   */
  findGoodsType(): Observable<any> {
    return this.http.get<any>(`/gdd/goods/findGoodsType`);
  }

  /**
   * 修改商品类别信息
   * @param GoodsTypeFormValue
   */
  modifyGoodsType(GoodsTypeFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/goods/modifyGoodsType`, GoodsTypeFormValue);
  }

  /**
   * 删除商品类别信息
   * @param id
   */
  deleteGoodsType(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteGoodsType`, id);
  }

  /**
   * 分页查询商品信息
   * @returns {Observable<any>}
   */
  pageGoods(goods, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/goods/pageGoods/${pageNumber}/${pageSize}`, goods);
  }

  /**
   * 修改商品信息
   * @param goodsFormValue
   */
  modifyGoods(goodsFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/goods/modifyGoods`, goodsFormValue);
  }

  /**
   * 删除商品信息
   * @param id
   */
  deleteGoods(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteGoods`, id);
  }
}
