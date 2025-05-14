import {CommonModule} from '@angular/common';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from 'ngx-toastr';
import {Observable, finalize} from 'rxjs';
import {ProfileService} from 'src/app/service/administrator/profile.service';
import {ProfilePageService} from 'src/app/service/administrator/profilepage.service';
import {DialogService} from 'src/app/service/shared/dialog.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProfileModel, ProfileNewModel} from 'src/app/shared/administracao/profile.model';
import {CRUD_BASEURL} from "../../shared/token/crud-endpoint.token";
import {AppConstants} from "../../AppConstants";
import {CrudService} from "../../service/core/crud.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ProfilePageModel, ProfilePageNewModel} from "../../shared/administracao/profilepage.model";
import {PageModel} from "../../shared/administracao/page.model";
import {PageService} from "../../service/administrator/page.service";

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSystemProfiles},
    {provide: CrudService, useClass: CrudService},
    ProfilePageService
  ]
})
export class ProfileComponent {
  profiles = new MatTableDataSource<ProfileModel>();
  profilePages = new MatTableDataSource<ProfilePageModel>();
  displayedColumnsProfile = ["name", "pages", "action"];
  displayedColumnsProfilePages = ["name", "action"];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private crudServiceProfile: CrudService<ProfileModel>,
    private serviceProfilePage: ProfilePageService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private dialogService: DialogService,
  ) {

  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  ngAfterViewInit(): void {
    this.profiles.sort = this.sort;
    this.profiles.paginator = this.paginator;
  }

  public applyFilterProfiles = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.profiles.filter = input.value.trim().toLowerCase();
  }

  public applyFilterProfilePage = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.profilePages.filter = input.value.trim().toLowerCase();
  }

  loadProfiles() {
    this.spinner.show();
    this.crudServiceProfile.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(profiles => this.profiles.data = profiles);
  }

  loadProfilePages(id: number) {
    this.spinner.show();

    this.serviceProfilePage.getPagesByIdProfile(id).pipe(finalize(() => this.spinner.hide()))
      .subscribe(profilePages => this.profilePages.data = profilePages);
  }

  addProfile(): void {
    const dialogRef = this.dialog.open(ModalNewProfile, {
      data: new ProfileNewModel('')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProfiles();
    });
  }

  addProfilePage(): void {
    const dialogRef = this.dialog.open(ModalNewPageProfile, {
      data: new ProfilePageNewModel(0, 0)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfiles();
        this.loadProfilePages(0);
      }
    });
  }

  editProfile(profile: ProfileModel): void {
    this.dialogService.openNewEditDialog(profile, ModalNewProfile)
      .subscribe(result => {
        if (result) this.loadProfiles();
      });
  }

  deleteProfile(profile: ProfileModel) {
    this.dialogService.openDeleteDialog(profile.id, ModalDeleteProfileComponent)
      .subscribe(result => {
        if (result) this.loadProfiles();
      });
  }

  deleteProfilePage(profilePage: ProfilePageModel) {
    this.dialogService.openDeleteDialog(profilePage.id, ModalDeletePageProfileComponent)
      .subscribe(result => {
        if (result) {
          this.loadProfilePages(profilePage.id);
          this.loadProfiles();
        }
      });
  }
}


@Component({
  selector: 'modal-new-profile',
  templateUrl: 'modal-new-profile.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSystemProfiles},
    {provide: CrudService, useClass: CrudService}
  ]
})

export class ModalNewProfile implements OnInit {
  registerForm!: FormGroup;
  profile!: ProfileNewModel | ProfileModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProfileNewModel | ProfileModel,
    public dialogRef: MatDialogRef<ModalNewProfile>,
    private fb: FormBuilder,
    private crudService: CrudService<ProfileNewModel | ProfileModel>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    this.profile = data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.profile) this.registerForm.patchValue(this.profile);
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      profile_name: ['', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private buildProfileObject(): ProfileNewModel | ProfileModel {
    const values = this.registerForm.value;
    return {
      ...values,
      id: (this.profile as ProfileModel)?.id ?? null
    };
  }

  save(): void {
    if (!this.registerForm.valid) return;

    const isNew = (this.profile as ProfileModel)?.id == null;
    const profileToSave = this.buildProfileObject();

    this.spinner.show();

    const save$ = isNew
      ? this.crudService.add(profileToSave)
      : this.crudService.update(profileToSave);

    save$.pipe(finalize(() => this.spinner.hide())).subscribe({
      next: () => {
        this.toastr.success('Perfil salvo com sucesso!');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.warning('Não foi possível realizar esta operação!');
        this.dialogRef.close(false);
      }
    });
  }
}

@Component({
  selector: 'modal-delete-profile',
  templateUrl: 'modal-delete-profile.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSystemProfiles},
    {provide: CrudService, useClass: CrudService}
  ]
})
export class ModalDeleteProfileComponent {
  onNoClick(): void {
    this.dialogRef.close();
  }

  itemId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<ModalDeleteProfileComponent>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private crudService: CrudService<ProfileModel>
  ) {
    this.itemId = data;
  }

  delete(): void {
    this.spinner.show();
    this.crudService.delete(this.itemId!)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.toastr.success('Perfil excluído com sucesso!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.warning('Não foi possível realizar essa operação!');
          this.dialogRef.close(false);
        }
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}


@Component({
  selector: 'modal-new-page-profile',
  templateUrl: 'modal-new-page-profile.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule, MatAutocompleteModule, MatSelectModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSystemPageProfiles},
    {provide: CrudService, useClass: CrudService},
    ProfileService,
    PageService
  ]
})

export class ModalNewPageProfile implements OnInit {
  registerFormPageProfile!: FormGroup;
  profilePage!: ProfilePageNewModel;
  profiles!: ProfileModel[];
  pages!: PageModel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProfilePageNewModel,
    public dialogRef: MatDialogRef<ModalNewPageProfile>,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private serviceProfile: ProfileService,
    private servicePage: PageService,
    private crudService: CrudService<ProfilePageNewModel>
  ) {
    this.profilePage = data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.profilePage) this.registerFormPageProfile.patchValue(this.profilePage);
    this.loadProfiles();
    this.loadPages();
  }

  initForm(): void {
    this.registerFormPageProfile = this.fb.group({
      id_profile: ['', Validators.required],
      id_page: ['', Validators.required]
    });
  }

  loadProfiles() {
    this.spinner.show();
    this.serviceProfile.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(profiles => this.profiles = profiles);
  }

  loadPages() {
    this.spinner.show();
    this.servicePage.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(pages => this.pages = pages);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private buildProfileObject(): ProfilePageNewModel {
    const values = this.registerFormPageProfile.value;
    return {
      ...values
    };
  }

  save(): void {
    if (!this.registerFormPageProfile.valid) return;

    this.spinner.show();

    const save$ = this.crudService.add(this.buildProfileObject());

    save$.pipe(finalize(() => this.spinner.hide())).subscribe({
      next: () => {
        this.toastr.success('Página vinculada ao perfil com sucesso!');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.warning('Não foi possível realizar esta operação!');
        this.dialogRef.close(false);
      }
    });
  }
}


@Component({
  selector: 'modal-delete-page-profile',
  templateUrl: 'modal-delete-page-profile.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSystemPageProfiles},
    {provide: CrudService, useClass: CrudService}
  ]
})
export class ModalDeletePageProfileComponent {

  onNoClick(): void {
    this.dialogRef.close();
  }

  itemId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<ModalDeleteProfileComponent>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private crudService: CrudService<ProfilePageModel>
  ) {
    this.itemId = data;
  }

  delete(): void {
    this.spinner.show();
    this.crudService.delete(this.itemId!)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.toastr.success('Página desvinculada do perfil com sucesso!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.warning('Não foi possível realizar essa operação!');
          this.dialogRef.close(false);
        }
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
