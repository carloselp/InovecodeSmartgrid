import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SolarplantModel, SolarplantNewModel} from "../../shared/administracao/solarplant.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {SolarplantService} from "../../service/administrator/solarplant.service";
import {DialogService} from "../../service/shared/dialog.service";
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ToastrService} from "ngx-toastr";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {CRUD_BASEURL} from "../../shared/token/crud-endpoint.token";
import {AppConstants} from "../../AppConstants";
import {CrudService} from "../../service/core/crud.service";
import {PageModel, PageNewModel} from "../../shared/administracao/page.model";
import {finalize} from "rxjs";
import {ModalDeletePageComponent, ModalNewPage} from "../page/page.component";

@Component({
  standalone: false,
  selector: 'app-solarplant',
  templateUrl: './solarplant.component.html',
  styleUrls: ['./solarplant.component.scss'],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSolarPlant},
    {provide: CrudService, useClass: CrudService}
  ]
})
export class SolarplantComponent {
  solarplants = new MatTableDataSource<SolarplantModel>();
  displayedColumns = ["name", "action"];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private crudService: CrudService<SolarplantModel>,
              private spinner: NgxSpinnerService,
              public dialog: MatDialog,
              private dialogService: DialogService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadSolarplants();
  }

  ngAfterViewInit(): void {
    this.solarplants.sort = this.sort;
    this.solarplants.paginator = this.paginator;
  }

  public applyFilter = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.solarplants.filter = input.value.trim().toLowerCase();
  }

  public loadSolarplants() {
    this.spinner.show();
    this.crudService.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(solarplants => this.solarplants.data = solarplants);
  }

  add(): void {
    const dialogRef = this.dialog.open(ModalNewEditSolarPlant, {
      data: new SolarplantNewModel('')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSolarplants();
    });
  }

  edit(page: SolarplantModel): void {
    this.dialogService.openNewEditDialog(page, ModalNewEditSolarPlant)
      .subscribe(result => {
        if (result) this.loadSolarplants();
      });
  }

  delete(page: SolarplantModel): void {
    this.dialogService.openDeleteDialog(page.id, ModalDeleteSolarplant)
      .subscribe(result => {
        if (result) this.loadSolarplants();
      });
  }

  public getSolarInverters(id: number) {
    this.router.navigate(['solarplant', id, 'solarinverter']);
  }
}

@Component({
  selector: 'modal-new-edit-solarplant',
  templateUrl: 'modal-new-edit-solarplant.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    { provide: CRUD_BASEURL, useValue: AppConstants.baseSolarPlant },
    { provide: CrudService, useClass: CrudService }
  ]
})

export class ModalNewEditSolarPlant implements OnInit {
  registerForm!: FormGroup;
  solarplant!: SolarplantNewModel | SolarplantModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SolarplantNewModel | SolarplantModel,
    public dialogRef: MatDialogRef<ModalNewEditSolarPlant>,
    private fb: FormBuilder,
    private crudService: CrudService<SolarplantNewModel | SolarplantModel>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    this.solarplant = data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.solarplant) this.registerForm.patchValue(this.solarplant);
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private buildPageObject(): SolarplantNewModel | SolarplantModel{
    const values = this.registerForm.value;
    return {
      ...values,
      id: (this.solarplant as SolarplantModel)?.id ?? null
    };
  }

  save(): void {
    if (!this.registerForm.valid) return;

    const isNew = (this.solarplant as SolarplantModel)?.id == null;
    const solarplantToSave = this.buildPageObject();

    this.spinner.show();

    const save$ = isNew
      ? this.crudService.add(solarplantToSave)
      : this.crudService.update(solarplantToSave);

    save$.pipe(finalize(() => this.spinner.hide())).subscribe({
      next: () => {
        this.toastr.success('Usina salva com sucesso!');
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
  selector: 'modal-delete-solarplant',
  templateUrl: 'modal-delete-solarplant.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    { provide: CRUD_BASEURL, useValue: AppConstants.baseSolarPlant },
    { provide: CrudService, useClass: CrudService }
  ]
})
export class ModalDeleteSolarplant {
  itemId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<ModalDeleteSolarplant>,
    private toastr: ToastrService,
    private crudService: CrudService<SolarplantModel>,
    private spinner: NgxSpinnerService,
  ) {
    this.itemId = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(): void {
    this.spinner.show();
    this.crudService.delete(this.itemId!)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: () => {
          this.toastr.success('Usina excluída com sucesso!');
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
