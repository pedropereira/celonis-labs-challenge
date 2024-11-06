import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeUserDialogComponent } from './make-user-dialog.component';

describe('MakeUserDialogComponent', () => {
  let component: MakeUserDialogComponent;
  let fixture: ComponentFixture<MakeUserDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeUserDialogComponent]
    });
    fixture = TestBed.createComponent(MakeUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
