import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { STORAGE_KEYS } from '../services/storage.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (token) {
    const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${parsedToken}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
