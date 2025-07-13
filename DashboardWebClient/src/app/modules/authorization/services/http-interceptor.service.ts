import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor() { }

  //interception request and add a token to header 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(request);
  }
}
