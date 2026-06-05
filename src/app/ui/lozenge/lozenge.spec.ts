import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lozenge } from './lozenge';

describe('Lozenge', () => {
  let component: Lozenge;
  let fixture: ComponentFixture<Lozenge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lozenge],
    }).compileComponents();

    fixture = TestBed.createComponent(Lozenge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
