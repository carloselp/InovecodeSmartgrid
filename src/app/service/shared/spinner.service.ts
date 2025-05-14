// spinner.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxSpinnerService {
  private spinnerVisible = new BehaviorSubject<boolean>(false);
  isSpinnerVisible$ = this.spinnerVisible.asObservable();

  show(): void {
    this.spinnerVisible.next(true);
  }

  hide(): void {
    this.spinnerVisible.next(false);
  }
}
