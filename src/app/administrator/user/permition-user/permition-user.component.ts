import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {finalize, Observable} from 'rxjs';
import {PageUserService} from 'src/app/service/administrator/pageuser.service';
import {ProfileUserService} from 'src/app/service/administrator/profileUser.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProfileUserModel, ProfileUserNewModel} from "../../../shared/administracao/profileuser.model";
import {PageUserModel, PageUserNewModel} from "../../../shared/administracao/pageuser.model";
import {CrudService} from "../../../service/core/crud.service";
import {ProfileModel} from "../../../shared/administracao/profile.model";
import {ProfilePageService} from "../../../service/administrator/profilepage.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogService} from "../../../service/shared/dialog.service";

@Component({
  standalone: false,
  selector: 'app-permition-user',
  templateUrl: './permition-user.component.html',
  styleUrls: ['./permition-user.component.scss'],
  providers: [
    ProfileUserService,
    PageUserService
  ]
})
export class PermitionUserComponent implements OnInit {
  profilesUser!: ProfileUserModel[];
  pagesUser!: PageUserModel[];
  userId!: number;

  displayedColumnsProfile: string[] = ['action', 'profile'];
  displayedColumnsPage: string[] = ['action', 'page'];

  constructor(
    private serviceProfile: ProfileUserService,
    private servicePage: PageUserService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
    });
    this.loadProfiles();
    this.loadPages();
  }

  loadProfiles() {
    this.spinner.show();
    this.serviceProfile.getProfilesByIdUser(this.userId).pipe(finalize(() => this.spinner.hide()))
      .subscribe(profiles => this.profilesUser = profiles);
  }

  loadPages() {
    this.spinner.show();
    this.servicePage.getPagesByIdUser(this.userId).pipe(finalize(() => this.spinner.hide()))
      .subscribe(pages => this.pagesUser = pages);
  }

  checked(element: number) {
    if (element > 0) {
      return true;
    } else {
      return false;
    }
  }

  disabled(element: any) {
    if (element == 0) {
      return true;
    } else {
      return false;
    }
  }

  addPage(page: PageUserModel) {
    const isAdd = page.id == 0;
    this.spinner.show();

    if (isAdd) {
      this.servicePage.add(new PageUserNewModel(this.userId, page.id_page)).pipe(finalize(() => this.spinner.hide())).subscribe({
        next: () => {
          this.toastr.success('Página vinculada com sucesso!');
          this.loadPages();
        },
        error: () => {
          this.toastr.warning('Não foi possível realizar esta operação!');
        }
      });
    } else {
      this.servicePage.delete(page.id)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe({
          next: () => {
            this.toastr.success('Página desvinculada com sucesso!');
            this.loadPages();
          },
          error: () => {
            this.toastr.warning('Não foi possível realizar essa operação!');
          }
        });
    }
  }

  addProfile(profile: ProfileUserModel) {
    const isAdd = profile.id == 0;
    this.spinner.show();

    if (isAdd) {
      this.serviceProfile.add(new ProfileUserNewModel(this.userId, profile.id_profile)).pipe(finalize(() => this.spinner.hide())).subscribe({
        next: () => {
          this.toastr.success('Página vinculada com sucesso!');
          this.loadProfiles();
        },
        error: () => {
          this.toastr.warning('Não foi possível realizar esta operação!');
        }
      });
    } else {
      this.serviceProfile.delete(profile.id)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe({
          next: () => {
            this.toastr.success('Página desvinculada com sucesso!');
            this.loadProfiles();
          },
          error: () => {
            this.toastr.warning('Não foi possível realizar essa operação!');
          }
        });
    }
  }
}
