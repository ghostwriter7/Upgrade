import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDetails } from './skill-details';

describe('SkillDetails', () => {
  let component: SkillDetails;
  let fixture: ComponentFixture<SkillDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
