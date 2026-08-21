import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSessionSelector } from './skill-session-selector';

describe('SkillSessionSelector', () => {
  let component: SkillSessionSelector;
  let fixture: ComponentFixture<SkillSessionSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillSessionSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillSessionSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
