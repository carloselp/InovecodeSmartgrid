import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  exp: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  isTokenValid(token: string): boolean {
    try {
      if (!token) return false;

      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return false;
    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (!token && !this.isTokenValid(localStorage.getItem('token')!)) {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const menu = JSON.parse(localStorage.getItem('menu') || '[]');
    const currentPath = state.url.replace('/', '');
    const hasAccess = menu.some((item: any) => item.Type === currentPath);

    if(currentPath === '')
      return true;

    if (!hasAccess) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
