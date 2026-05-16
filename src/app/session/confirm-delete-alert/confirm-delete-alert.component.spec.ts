import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteAlert } from './confirm-delete-alert.component';

describe('DeleteSessionAlert', () => {
  let component: ConfirmDeleteAlert;
  let fixture: ComponentFixture<ConfirmDeleteAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
