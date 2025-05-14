import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ToastrService} from "ngx-toastr";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {finalize} from "rxjs";
import {SolarinverterModel, SolarinverterNewModel} from "../../../shared/administracao/solarinverter.model";
import {DialogService} from "../../../service/shared/dialog.service";
import {CRUD_BASEURL} from "../../../shared/token/crud-endpoint.token";
import {AppConstants} from "../../../AppConstants";
import {CrudService} from "../../../service/core/crud.service";

@Component({
  standalone: false,
  selector: 'app-solarinverter',
  templateUrl: './solarinverter.component.html',
  styleUrls: ['./solarinverter.component.scss'],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSolarInverter},
    {provide: CrudService, useClass: CrudService}
  ]
})
export class SolarinverterComponent {
  solarinverters = new MatTableDataSource<SolarinverterModel>();
  displayedColumns = ["name", "action"];
  solarPlantId!: number;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private crudService: CrudService<SolarinverterModel>,
              private spinner: NgxSpinnerService,
              public dialog: MatDialog,
              private dialogService: DialogService,
              private router: Router,
              private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.solarPlantId = +params['id'];
    });

    this.loadSolarinverters();
  }

  ngAfterViewInit(): void {
    this.solarinverters.sort = this.sort;
    this.solarinverters.paginator = this.paginator;
  }

  public applyFilter = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.solarinverters.filter = input.value.trim().toLowerCase();
  }

  public loadSolarinverters() {
    this.spinner.show();
    this.crudService.getAll().pipe(finalize(() => this.spinner.hide()))
      .subscribe(solarinverters => this.solarinverters.data = solarinverters);
  }

  add(): void {
    const dialogRef = this.dialog.open(ModalNewEditSolarinverter, {
      data: new SolarinverterNewModel('', this.solarPlantId)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSolarinverters();
    });
  }

  edit(page: SolarinverterModel): void {
    this.dialogService.openNewEditDialog(page, ModalNewEditSolarinverter)
      .subscribe(result => {
        if (result) this.loadSolarinverters();
      });
  }

  delete(page: SolarinverterModel): void {
    this.dialogService.openDeleteDialog(page.id, ModalDeleteSolarinverter)
      .subscribe(result => {
        if (result) this.loadSolarinverters();
      });
  }

  public getSolarInverters(id: number) {
    this.router.navigate(['solarinverter', id, 'solarinverter']);
  }
}

@Component({
  selector: 'modal-new-edit-solarinverter',
  templateUrl: 'modal-new-edit-solarinverter.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSolarInverter},
    {provide: CrudService, useClass: CrudService}
  ]
})

export class ModalNewEditSolarinverter implements OnInit {
  registerForm!: FormGroup;
  solarinverter!: SolarinverterNewModel | SolarinverterModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SolarinverterNewModel | SolarinverterModel,
    public dialogRef: MatDialogRef<ModalNewEditSolarinverter>,
    private fb: FormBuilder,
    private crudService: CrudService<SolarinverterNewModel | SolarinverterModel>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    this.solarinverter = data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.solarinverter) this.registerForm.patchValue(this.solarinverter);
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private buildPageObject(): SolarinverterNewModel | SolarinverterModel {
    const values = this.registerForm.value;
    return {
      ...values,
      id: (this.solarinverter as SolarinverterModel)?.id ?? null,
      id_solarplant: this.solarinverter.id_solarplant
    };
  }

  save(): void {
    if (!this.registerForm.valid) return;

    const isNew = (this.solarinverter as SolarinverterModel)?.id == null;
    const solarinverterToSave = this.buildPageObject();

    this.spinner.show();

    const save$ = isNew
      ? this.crudService.add(solarinverterToSave)
      : this.crudService.update(solarinverterToSave);

    save$.pipe(finalize(() => this.spinner.hide())).subscribe({
      next: () => {
        this.toastr.success('Inversor salvo com sucesso!');
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
  selector: 'modal-delete-solarinverter',
  templateUrl: 'modal-delete-solarinverter.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  providers: [
    {provide: CRUD_BASEURL, useValue: AppConstants.baseSolarInverter},
    {provide: CrudService, useClass: CrudService}
  ]
})
export class ModalDeleteSolarinverter {
  itemId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<ModalDeleteSolarinverter>,
    private toastr: ToastrService,
    private crudService: CrudService<SolarinverterModel>,
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
          this.toastr.success('Inversor excluído com sucesso!');
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
