import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCoverage } from './skill-coverage';

describe('SkillCoverage', () => {
  let component: SkillCoverage;
  let fixture: ComponentFixture<SkillCoverage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillCoverage],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillCoverage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
