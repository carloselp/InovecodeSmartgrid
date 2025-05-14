import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/service/administrator/login.service';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private loginService: LoginService
  ) {

  }

  sair() {
    this.loginService.logoutUser('/login');
  }

}
