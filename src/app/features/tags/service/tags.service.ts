import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Tags, TagsInsertRequest, TagsSearchRequest, TagsSearchResponse, TagsUpdateRequest, TagsUser} from '../model/tags';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class TagsService extends BaseService {
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * @author TruongNH
   * date: 09/12/2020
   * desc: get detail tags
   */
  getDetail(id: string): Observable<TagsUser> {
    const param = new HttpParams().append('tagId', id);
    return this.doGet('/saleskit/tags/getInfoTag', param).pipe(
      map(res => res.data[0])
    );
  }

  /**
   * @author TruongNH
   * @param tagsType: string
   * date: 07/12/2020
   * desc: get list tags by type
   */
  getTagsList(tagsType): Observable<Tags[]> {
    const param = new HttpParams().append('type', tagsType);
    return this.doGet('/saleskit/tags/searchType', param).pipe(
      map(res => res.data)
    );
  }

  /**
   * @author TruongNH
   * @param request: TagsSearchRequest
   * date: 07/12/2020
   * desc: search tags by name and type, paging, sorting
   */
  searchTags(request: TagsSearchRequest): Observable<TagsSearchResponse> {
    return this.doPost('/saleskit/tags/search', request).pipe(
      map(res => res.data[0])
    );
  }

  /**
   * search tags by name and type, paging, sorting, not include tagType and assignee
   * @author TruongNH
   * @param request: TagsSearchRequest
   * date: 10/12/2020
   */
  searchTagExp(request: TagsSearchRequest): Observable<TagsSearchResponse> {
    return this.doPost('/saleskit/tags/search-exp', request).pipe(
      map(res => res.data[0])
    );
  }

  /**
   * @author TruongNH
   * @param body: TagsInsertRequest
   * date: 09/12/2020
   * desc: create new tag
   */
  createTags(body: TagsInsertRequest): Observable<ApiResultResponse> {
    return this.doPost('/saleskit/tags/insert', body).pipe(
      map(res => res)
    );
  }

  /**
   * @author TruongNH
   * @param body: TagsUpdateRequest
   * date: 09/12/2020
   * desc: update tags
   */
  updateTags(body: TagsUpdateRequest): Observable<any> {
    return this.doPost('/saleskit/tags/update', body);
  }

  /**
   * @author TruongNH
   * @param id: id of tags
   * date: 09/12/2020
   * desc: create new tags
   */
  deleteTag(id): Observable<any> {
    const param = new HttpParams().append('tagId', id);
    return this.doDelete('/saleskit/tags/delete', param);
  }

  /**
   * get all tag include id and value tag only
   * returns {Observable<TagsUser[]>}
   */
  getAllTag(): Observable<TagsUser[]> {
    return this.doGet('/saleskit/tags/getAll').pipe(
      map(res => res.data)
    );
  }

  /**
   * @author TruongNH
   * @param id: id of tags
   * date: 08/12/2020
   * desc: set breadcrumb in TagComponent
   */
  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage$.next(page);
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'TagsService';
  }
}
