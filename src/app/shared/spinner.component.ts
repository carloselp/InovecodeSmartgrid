import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from '../service/shared/spinner.service';

@Component({
standalone: false,
  
  selector: 'app-spinner',
  template: `<div class="preloader" *ngIf="isSpinnerVisible">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
    </div>`,
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = false;

  @Input()
  public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private spinnerService: NgxSpinnerService
  ) {
    // Controla a visibilidade do spinner durante a navegação
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );

    // Controla a visibilidade do spinner através do serviço
    this.spinnerService.isSpinnerVisible$.subscribe(isVisible => {
      this.isSpinnerVisible = isVisible;
    });
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}