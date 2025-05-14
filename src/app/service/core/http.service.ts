import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HTTP_BASEURL} from "../../shared/token/crud-endpoint.token";
import {Inject, Injectable} from "@angular/core";

@Injectable()
export class HttpService<T> {

  constructor(
    protected http: HttpClient,
    @Inject(HTTP_BASEURL) protected baseUrl: string
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

  get(params?: { [key: string]: any }): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value);
        }
      }
    }

    return this.http.get<T>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }
}
