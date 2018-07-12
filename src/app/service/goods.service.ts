import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(private http: HttpClient) { }

  /**
   * 分页查询商品类别信息
   * @returns {Observable<any>}
   */
  pageByGoodsType(goodsType, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/goods/pageByGoodsType/${pageNumber}/${pageSize}`, goodsType);
  }

  /**
   * 分页查询商品信息
   * @returns {Observable<any>}
   */
  pageByGoods(goods, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/goods/pageByGoods/${pageNumber}/${pageSize}`, goods);
  }


  /**
   * 修改商品类别信息
   * @param goodsTypeFormValue
   */
  modifyByGoodsType(goodsTypeFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/goods/modifyByGoodsType`, goodsTypeFormValue);
  }

  /**
   * 修改商品信息
   * @param goodsFormValue
   */
  modifyByGoods(goodsFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/goods/modifyByGoods`, goodsFormValue);
  }

  /**
   * 删除商品类别信息
   * @param id
   */
  deleteByGoodsType(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteByGoodsType`, id);
  }

  /**
   * 删除商品信息
   * @param id
   */
  deleteByGoods(id): Observable<any> {
    return this.http.post<any>(`/gdd/goods/deleteByGoods`, id);
  }
}
