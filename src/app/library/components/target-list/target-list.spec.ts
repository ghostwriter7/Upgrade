import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetList } from './target-list';

describe('TargetList', () => {
  let component: TargetList;
  let fixture: ComponentFixture<TargetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetList],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
