import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  private isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (this.isTokenValid(token)) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
