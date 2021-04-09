import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmDialogBoxComponent } from './bm-dialog-box.component';

describe('BmDialogBoxComponent', () => {
  let component: BmDialogBoxComponent;
  let fixture: ComponentFixture<BmDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BmDialogBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
