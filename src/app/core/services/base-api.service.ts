import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export abstract class BaseApiService<T> {
  protected abstract endpoint: string;

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    protected http: HttpClient,
    protected configurationService: ConfigurationService
  ) {}

  protected get baseUrl(): string {
    return this.configurationService.getApiBaseUrl();
  }

  protected get fullEndpoint(): string {
    return `${this.baseUrl}/${this.endpoint}`;
  }

  // GET all items
  getAll(): Observable<T[]> {
    return this.http.get<any>(this.fullEndpoint).pipe(
      map(response => {
        console.log('Raw API response:', response);
        // Handle both ApiResponse format and direct array
        if (response && response.data) {
          return response.data;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          console.warn('Unexpected response format:', response);
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }

  // GET item by ID
  getById(id: number): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.fullEndpoint}/${id}`).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // POST new item
  create(item: Partial<T>): Observable<T> {
    return this.http.post<ApiResponse<T>>(this.fullEndpoint, item, this.httpOptions).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // PUT/PATCH update item
  update(id: number, item: Partial<T>): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.fullEndpoint}/${id}`, item, this.httpOptions).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // DELETE item
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.fullEndpoint}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // GET with query parameters
  getWithParams(params: Record<string, any>): Observable<T[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ApiResponse<T[]>>(this.fullEndpoint, { params: httpParams }).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // Custom GET request
  protected customGet<TResult>(path: string, params?: Record<string, any>): Observable<TResult> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<TResult>>(`${this.fullEndpoint}${path}`, { params: httpParams }).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // Custom POST request
  protected customPost<TResult>(path: string, data: any): Observable<TResult> {
    return this.http.post<ApiResponse<TResult>>(`${this.fullEndpoint}${path}`, data, this.httpOptions).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // Custom PUT request
  protected customPut<TResult>(path: string, data: any): Observable<TResult> {
    return this.http.put<ApiResponse<TResult>>(`${this.fullEndpoint}${path}`, data, this.httpOptions).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // Custom PATCH request
  protected customPatch<TResult>(path: string, data: any): Observable<TResult> {
    return this.http.patch<ApiResponse<TResult>>(`${this.fullEndpoint}${path}`, data, this.httpOptions).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  // Custom DELETE request
  protected customDelete(path: string): Observable<void> {
    return this.http.delete<void>(`${this.fullEndpoint}${path}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  protected handleError(error: any): Observable<never> {
    console.error('API Error:', error);

    let errorMessage = 'An error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return throwError(() => new Error(errorMessage));
  }
}
