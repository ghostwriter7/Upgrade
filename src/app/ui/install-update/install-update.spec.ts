import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallUpdate } from './install-update';

describe('InstallUpdate', () => {
  let component: InstallUpdate;
  let fixture: ComponentFixture<InstallUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(InstallUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
