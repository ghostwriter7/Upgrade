import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseLogSummary } from './exercise-log-summary';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';
import { By } from '@angular/platform-browser';
import { Lozenge } from '@ui/lozenge/lozenge';
import { DebugElement } from '@angular/core';

describe('ExerciseLogSummary', () => {
  let component: ExerciseLogSummary;
  let fixture: ComponentFixture<ExerciseLogSummary>;

  const log = new ExerciseLog('sessionId', 'exerciseId');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseLogSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseLogSummary);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exerciseLog', log);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('computeSetSummary', () => {
    const empty = () => new ExerciseLog('sessionId', 'exerciseId');
    const getLozenges = () => fixture.debugElement.queryAll(By.directive(Lozenge));

    const content = (debug: DebugElement) => debug.nativeElement.innerHTML;

    it('should display no summary when there are no sets', () => {
      fixture.componentRef.setInput('exerciseLog', empty());

      expect(getLozenges()).toEqual([]);
    });

    it('should display a condensed summary when all sets are equal', () => {
      const log = empty().withSets([bwSet(0, 10), bwSet(1, 10), bwSet(2, 10)]);
      fixture.componentRef.setInput('exerciseLog', log);
      fixture.detectChanges();

      const lozenges = getLozenges();
      expect(lozenges.length).toBe(1);
      expect(content(lozenges[0])).toContain('3 x 10');
    });

    it('should display a detailed summary when sets are different', () => {
      const log = empty().withSets([bwSet(0, 10), bwSet(1, 12), bwSet(2, 13)]);
      fixture.componentRef.setInput('exerciseLog', log);
      fixture.detectChanges();

      const lozenges = getLozenges();
      expect(lozenges.length).toBe(3);
      expect(content(lozenges[0])).toContain('10');
      expect(content(lozenges[1])).toContain('12');
      expect(content(lozenges[2])).toContain('13');
    });
  });
});
