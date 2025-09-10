import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/administrator/login.service';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  isLoading!: boolean;

  public username: String = ''
  public password: String = ''

  public formEstado: string = 'disabled'

  constructor(
    private loginService: LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.loginService.logado()
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  public async confirmaLogin(): Promise<void> {
    this.isLoading = true;
    this.spinner.show();

    var userApi = Object.assign({
      user_login: this.username,
      access_key: this.password
    });
    await this.loginService.efetivaLogin(userApi);

    this.isLoading = false;
    this.spinner.hide();
  }
}
