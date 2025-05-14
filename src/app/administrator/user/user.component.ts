import {HttpClient} from '@angular/common/http';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UserModel, UserNewModel} from 'src/app/shared/administracao/user.model';
import {MatTableFilter} from 'mat-table-filter';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DialogService} from 'src/app/service/shared/dialog.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from 'src/app/service/administrator/user.service';
import {SolarplantModel} from "../../shared/administracao/solarplant.model";
import {CRUD_BASEURL} from "../../shared/token/crud-endpoint.token";
import {AppConstants} from "../../AppConstants";
import {CrudService} from "../../service/core/crud.service";
import {ProfilePageService} from "../../service/administrator/profilepage.service";
import {PageUserService} from "../../service/administrator/pageuser.service";
import {ProfileUserService} from "../../service/administrator/profileUser.service";
import {ProfileModel} from "../../shared/administracao/profile.model";
import {ProfilePageModel} from "../../shared/administracao/profilepage.model";
import {finalize} from "rxjs";
import {PageModel, PageNewModel} from "../../shared/administracao/page.model";
import {ModalDeletePageComponent, ModalNewPage} from "../page/page.component";

@Component({
  standalone: false,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseUser},
    {provide: CrudService, useClass: CrudService}
  ]
})
export class UserComponent {
  users = new MatTableDataSource<UserModel>();
  displayedColumnsUser = ["login", "name", "lastname", "action"];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private crudService: CrudService<UserModel>,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.users.sort = this.sort;
    this.users.paginator = this.paginator;
  }

  public applyFilter = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.users.filter = input.value.trim().toLowerCase();
  }

  loadUsers(): void {
    this.spinner.show();
    this.crudService.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(users => this.users.data = users);
  }

  add(): void {
    const dialogRef = this.dialog.open(ModalNewUser, {
      data: new UserNewModel('', '', '', '', '', '', 1)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  edit(user: UserModel): void {
    this.dialogService.openNewEditDialog(user, ModalNewUser)
      .subscribe(result => {
        if (result) this.loadUsers();
      });
  }

  delete(user: UserModel): void {
    this.dialogService.openDeleteDialog(user.id, ModalDeleteUserComponent)
      .subscribe(result => {
        if (result) this.loadUsers();
      });
  }

  getItens(id: number) {
    this.router.navigate(['user/permition', id]);
  }
}

@Component({
  selector: 'modal-new-user',
  templateUrl: 'modal-new-user.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseUser},
    {provide: CrudService, useClass: CrudService}
  ]
})

export class ModalNewUser implements OnInit  {
  registerForm!: FormGroup;
  user!: UserNewModel | UserModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserNewModel | UserModel,
    public dialogRef: MatDialogRef<ModalNewUser>,
    private fb: FormBuilder,
    private crudService: CrudService<UserNewModel | UserModel>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    this.user = data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.user) this.registerForm.patchValue(this.user);
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user_login: ['', Validators.required],
      access_key: ['', Validators.required],
      status: [1, Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private buildPageObject(): UserNewModel | UserModel {
    const values = this.registerForm.value;
    return {
      ...values,
      id: (this.user as UserModel)?.id ?? null,
      status: (this.user as UserModel)?.id == null ? '1' : values.nav_item
    };
  }

  save(): void {
    if (!this.registerForm.valid) return;

    const isNew = (this.user as UserModel)?.id == null;
    const userToSave = this.buildPageObject();

    this.spinner.show();

    const save$ = isNew
      ? this.crudService.add(userToSave)
      : this.crudService.update(userToSave);

    save$.pipe(finalize(() => this.spinner.hide())).subscribe({
      next: () => {
        this.toastr.success('Usuário salvo com sucesso!');
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
  selector: 'modal-delete-user',
  templateUrl: 'modal-delete-user.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    { provide: CRUD_BASEURL, useValue: AppConstants.baseSystemPages },
    { provide: CrudService, useClass: CrudService }
  ]
})
export class ModalDeleteUserComponent {

  onNoClick(): void {
    this.dialogRef.close();
  }

  itemId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<ModalDeleteUserComponent>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private crudService: CrudService<UserModel>
  ) {
    this.itemId = data;
  }

  delete(): void {
    this.spinner.show();
    this.crudService.delete(this.itemId!)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.toastr.success('Usuário excluído com sucesso!');
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
