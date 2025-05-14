import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import {Observable} from "rxjs";
import {ModalDeleteUserComponent} from "../../administrator/user/user.component";

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  openNewEditDialog<TEntity>(
    entity: TEntity,
    modalComponent: ComponentType<any>
  ): Observable<any> {

    const dialogRef = this.dialog.open(modalComponent, {
      data: entity,
    });

    return dialogRef.afterClosed();
  }

  openDeleteDialog(
    id: number,
    modalComponent: ComponentType<any>
  ): Observable<any> {

    const dialogRef = this.dialog.open(modalComponent, {
      data: id,
    });

    return dialogRef.afterClosed();
  }
}
