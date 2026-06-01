import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timer } from './timer';
import { queryByTestId } from '../../../../test/fixture.utils';

describe('Timer', () => {
  let component: Timer;
  let fixture: ComponentFixture<Timer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timer],
    }).compileComponents();

    fixture = TestBed.createComponent(Timer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => expect(component).toBeTruthy());

  const getActionButtons = () => queryByTestId<HTMLDivElement>(fixture, 'timer-actions');
  const getStartButton = () => queryByTestId<HTMLButtonElement>(fixture, 'timer-start');
  const getDisplayElement = () => queryByTestId<HTMLSpanElement>(fixture, 'timer-display');
  const getClearButton = () => queryByTestId<HTMLButtonElement>(fixture, 'timer-clear');
  const getPauseButton = () => queryByTestId<HTMLButtonElement>(fixture, 'timer-pause');
  const advanceTime = (time: number) => {
    vi.advanceTimersByTime(time);
    fixture.detectChanges();
  };
  const assertDisplay = (expected: string) =>
    expect(getDisplayElement()?.textContent).toBe(expected);

  it('should render action buttons by default', () => expect(getActionButtons()).toBeDefined());

  it('should hide action buttons', () => {
    fixture.componentRef.setInput('showControls', false);
    fixture.detectChanges();

    expect(getActionButtons()).toBeUndefined();
  });

  describe('Passage of time', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test.each([
      { time: 3000, expectedDisplay: '00:00:03' },
      { time: 1000, expectedDisplay: '00:00:01' },
      { time: 60_000, expectedDisplay: '00:01:00' },
      { time: 70_000, expectedDisplay: '00:01:10' },
      { time: 4530_000, expectedDisplay: '01:15:30' },
    ])('should start a timer and render a time display', ({ time, expectedDisplay }) => {
      getStartButton()?.click();

      advanceTime(time);

      assertDisplay(expectedDisplay);
    });

    it('should automatically start the timer', () => {
      fixture.componentRef.setInput('autoPlay', true);
      fixture.detectChanges();

      advanceTime(3000);

      assertDisplay('00:00:03');
    });

    it('should clear the timer back to zero', () => {
      getStartButton()?.click();

      advanceTime(5000);

      assertDisplay('00:00:05');
      assertDisplay('00:00:05');

      getClearButton()?.click();
      fixture.detectChanges();

      assertDisplay('00:00:00');
    });

    it('should pause the timer', () => {
      getStartButton()?.click();

      advanceTime(10000);

      assertDisplay('00:00:10');

      getPauseButton()?.click();
      fixture.detectChanges();

      advanceTime(10000);

      assertDisplay('00:00:10');
    });

    it('should resume the timer', () => {
      getStartButton()?.click();

      advanceTime(10000);

      assertDisplay('00:00:10');

      getPauseButton()?.click();
      fixture.detectChanges();

      advanceTime(10000);

      assertDisplay('00:00:10');

      getStartButton()?.click();
      fixture.detectChanges();

      advanceTime(10000);

      assertDisplay('00:00:20');
    });
  });
});
