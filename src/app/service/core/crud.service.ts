import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CRUD_BASEURL} from "../../shared/token/crud-endpoint.token";
import {Inject, Injectable} from "@angular/core";

@Injectable()
export class CrudService<T> {

  constructor(
    protected http: HttpClient,
    @Inject(CRUD_BASEURL) protected baseUrl: string
  ) {
  }

  protected getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const userId = localStorage.getItem('userId') || '';

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'UserId': `${userId}`
    });
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  add(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, entity, {
      headers: this.getAuthHeaders()
    });
  }

  update(entity: T): Observable<T> {
    return this.http.put<T>(this.baseUrl, entity, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
