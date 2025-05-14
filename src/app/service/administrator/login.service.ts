import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/shared/administracao/login.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from 'src/app/AppConstants';

@Injectable()

export class LoginService {

  jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }


  public async efetivaLogin(userApi: LoginModel) {
    this.spinner.show();
    let headers = new HttpHeaders({
      "accept": "text/plain",
      "Content-Type": "application/json",
    });
    let options = {
      headers,
    };

    return this.http.post(AppConstants.baseLogin, userApi, options).subscribe({
      next: (result: any) => {
        var token = JSON.parse(JSON.stringify(result)).accessToken;
        if (token != null && token != undefined && token != "") {

          localStorage.setItem('token', token);
          localStorage.setItem('userId', JSON.parse(this.jwtHelper.decodeToken(token).aud[0]!).UserId!);
          localStorage.setItem('menu', JSON.stringify(JSON.parse(this.jwtHelper.decodeToken(token).aud[0]!).Menu!));

          this.router.navigate([``]);
        } else {
          this.toastr.error('Usuário/Senha inválido, faça o login novamente', 'Erro de autenticação');
          this.router.navigate(["login"]);
        }
      },
      error: (err: any) => {
        console.error('Erro na requisição:', err);
        this.toastr.error('Ocorreu um erro ao efetuar login, tente novamente.', 'Erro de login');
        this.router.navigate(["login"]);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  logado() {
    const token = localStorage.getItem('token');

    if (token != null || token != undefined) {
      this.toastr.success('Você já estava logado, Bem vindo!');
      this.router.navigate(['/'])
      return this.jwtHelper.isTokenExpired(token!);
    } else {
      this.toastr.warning('Sua sessão expirou!');
      return this.jwtHelper.isTokenExpired(token!);
    }
  }

  logoutUser(route: string) {
    localStorage.removeItem('token');
    localStorage.removeItem("userId");
    localStorage.removeItem("menu");

    this.router.navigate([route]);
    this.spinner.hide();
  }
}
