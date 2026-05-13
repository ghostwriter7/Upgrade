import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSessionAlert } from './delete-session-alert';

describe('DeleteSessionAlert', () => {
  let component: DeleteSessionAlert;
  let fixture: ComponentFixture<DeleteSessionAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSessionAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSessionAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
