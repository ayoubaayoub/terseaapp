import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {ApplicationConfigService} from "../config/application-config.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private applicationConfigService: ApplicationConfigService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const serverApiUrl = this.applicationConfigService.getEndpointFor('');
    if (!request.url || (request.url.startsWith('http') && !(serverApiUrl && request.url.startsWith(serverApiUrl)))) {
      return next.handle(request);
    }
    const token: string | null = this.localStorage.retrieve('authenticationToken') ?? this.sessionStorage.retrieve('authenticationToken');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
