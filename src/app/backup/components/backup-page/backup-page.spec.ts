import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupPage } from './backup-page';

describe('BackupPage', () => {
  let component: BackupPage;
  let fixture: ComponentFixture<BackupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackupPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
