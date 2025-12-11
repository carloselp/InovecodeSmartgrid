import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'src/app/service/administrator/login.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  public username: string = '';
  public password: string = '';

  passwordVisible = false;

  constructor(
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.loginService.logado();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  public async confirmaLogin(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    this.spinner.show();

    try {
      const userApi = {
        user_login: this.username,
        access_key: this.password,
      };

      // Se quiser testar visualmente:
      await new Promise((res) => setTimeout(res, 2000));

      await this.loginService.efetivaLogin(userApi);
    } finally {
      this.isLoading = false;
      console.log('isLoading no finally:', this.isLoading);
      this.spinner.hide();
      this.cdr.detectChanges();
    }
  }
}
