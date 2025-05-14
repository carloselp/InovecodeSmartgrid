import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from 'ngx-toastr';
import {DialogService} from 'src/app/service/shared/dialog.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PageModel, PageNewModel} from 'src/app/shared/administracao/page.model';
import {finalize} from "rxjs";
import {CRUD_BASEURL} from "../../shared/token/crud-endpoint.token";
import {AppConstants} from "../../AppConstants";
import {CrudService} from "../../service/core/crud.service";

@Component({
  standalone: false,
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  providers: [
    { provide: CRUD_BASEURL, useValue: AppConstants.baseSystemPages },
    { provide: CrudService, useClass: CrudService }
  ]
})
export class PageComponent implements OnInit {
  pages = new MatTableDataSource<PageModel>();
  displayedColumns = ["group_menu", "name_page", "icon", "route", "action"];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private crudService: CrudService<PageModel>,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.loadPages();
  }

  ngAfterViewInit(): void {
    this.pages.sort = this.sort;
    this.pages.paginator = this.paginator;
  }

  public applyFilter = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.pages.filter = input.value.trim().toLowerCase();
  }

  loadPages(): void {
    this.spinner.show();
    this.crudService.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(pages => this.pages.data = pages);
  }

  add(): void {
    const dialogRef = this.dialog.open(ModalNewPage, {
      data: new PageNewModel('', '', '', '', '1')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPages();
    });
  }

  edit(page: PageModel): void {
    this.dialogService.openNewEditDialog(page, ModalNewPage)
      .subscribe(result => {
        if (result) this.loadPages();
      });
  }

  delete(page: PageModel): void {
    this.dialogService.openDeleteDialog(page.id, ModalDeletePageComponent)
      .subscribe(result => {
        if (result) this.loadPages();
      });
  }
}

@Component({
  selector: 'modal-new-page',
  templateUrl: 'modal-new-page.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    { provide: CRUD_BASEURL, useValue: AppConstants.baseSystemPages },
    { provide: CrudService, useClass: CrudService }
  ]
})

export class ModalNewPage implements OnInit {
  registerForm!: FormGroup;
  page!: PageNewModel | PageModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PageNewModel | PageModel,
    public dialogRef: MatDialogRef<ModalNewPage>,
    private fb: FormBuilder,
    private crudService: CrudService<PageNewModel | PageModel>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    this.page = data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.page) this.registerForm.patchValue(this.page);
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      name_page: ['', Validators.required],
      group_menu: ['', Validators.required],
      icon: ['', Validators.required],
      route: ['', Validators.required],
      nav_item: ['1', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private buildPageObject(): PageModel | PageNewModel {
    const values = this.registerForm.value;
    return {
      ...values,
      id: (this.page as PageModel)?.id ?? null,
      nav_item: (this.page as PageModel)?.id == null ? '1' : values.nav_item
    };
  }

  save(): void {
    if (!this.registerForm.valid) return;

    const isNew = (this.page as PageModel)?.id == null;
    const pageToSave = this.buildPageObject();

    this.spinner.show();

    const save$ = isNew
      ? this.crudService.add(pageToSave)
      : this.crudService.update(pageToSave);

    save$.pipe(finalize(() => this.spinner.hide())).subscribe({
      next: () => {
        this.toastr.success('Página salva com sucesso!');
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
  selector: 'modal-delete-page',
  templateUrl: 'modal-delete-page.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    { provide: CRUD_BASEURL, useValue: AppConstants.baseSystemPages },
    { provide: CrudService, useClass: CrudService }
  ]
})
export class ModalDeletePageComponent {
  onNoClick(): void {
    this.dialogRef.close();
  }

  itemId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<ModalDeletePageComponent>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private crudService: CrudService<PageModel>
  ) {
    this.itemId = data;
  }

  delete(): void {
    this.spinner.show();
    this.crudService.delete(this.itemId!)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.toastr.success('Página excluída com sucesso!');
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
