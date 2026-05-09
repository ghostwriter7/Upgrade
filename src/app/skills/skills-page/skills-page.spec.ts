import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsPage } from './skills-page';

describe('SkillsPage', () => {
  let component: SkillsPage;
  let fixture: ComponentFixture<SkillsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
