import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
  pageCover(itemForPage, pageNumber, pageSize): Observable<any> {
    return this.http.post<any>(`/gdd/cover/pageCover/${pageNumber}/${pageSize}`, itemForPage);
  }

  /**
   * 添加封面信息(上传图片)
   * {params: {'coverTypeName': coverFormValue.coverTypeName}}
   * @param coverFormValue
   */
  importCover(formData: FormData): Observable<any> {
    return this.http.post<any>(`/gdd/file/importCover`, formData);
  }

  /**
   * 修改封面信息
   * @param coverFormValue
   */
  modifyCover(coverFormValue): Observable<any> {
    return this.http.post<any>(`/gdd/cover/modifyCover`, coverFormValue);
  }

  /**
   * 删除封面信息
   * @param id
   */
  deleteCover(id): Observable<any> {
    return this.http.post<any>(`/gdd/cover/deleteCover`, id);
  }
}
