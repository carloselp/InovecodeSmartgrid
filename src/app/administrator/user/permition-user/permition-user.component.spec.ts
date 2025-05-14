import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitionUserComponent } from './permition-user.component';

describe('PermitionUserComponent', () => {
  let component: PermitionUserComponent;
  let fixture: ComponentFixture<PermitionUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitionUserComponent]
    });
    fixture = TestBed.createComponent(PermitionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
