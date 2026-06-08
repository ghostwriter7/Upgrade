import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetForm } from './set-form';
import { SetData } from './set-data.interface';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';

describe('SetForm', () => {
  let component: SetForm;
  let fixture: ComponentFixture<SetForm>;
  let loader: HarnessLoader;

  const initialValue: SetData = {
    type: 'bodyweight',
    reps: 1,
    weight: 0,
    duration: 0,
  };

  const setValue = (value: SetData = initialValue): void => {
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SetForm);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    setValue();

    await fixture.whenStable();
  });

  const queryByTestId = <T = Element>(testId: string): T | null =>
    fixture.nativeElement.querySelector(`[data-testid=${testId}]`) as T;

  const getDecrementRepsBtn = () => queryByTestId<HTMLButtonElement>('set-form-reps-decrement-btn');
  const getIncrementRepsBtn = () => queryByTestId<HTMLButtonElement>('set-form-reps-increment-btn');
  const getDecrementWeightBtn = () =>
    queryByTestId<HTMLButtonElement>('set-form-weight-decrement-btn');
  const getIncrementWeightBtn = () =>
    queryByTestId<HTMLButtonElement>('set-form-weight-increment-btn');
  const getDecrementDurationBtn = () =>
    queryByTestId<HTMLButtonElement>('set-form-duration-decrement-btn');
  const getIncrementDurationBtn = () =>
    queryByTestId<HTMLButtonElement>('set-form-duration-increment-btn');

  const clickSetTypeOption = async (type: ExerciseSetType) => {
    const group = await loader.getHarness(MatButtonToggleGroupHarness);
    const [toggle] = await group.getToggles({ selector: `[data-testid=set-form-type-${type}` });
    await toggle.check();
  };

  const assertRepButtonsExist = (exist = true) => {
    const decrement = getDecrementRepsBtn();
    const increment = getIncrementRepsBtn();
    if (exist) {
      expect(decrement).toBeTruthy();
      expect(increment).toBeTruthy();
    } else {
      expect(decrement).toBeNull();
      expect(increment).toBeNull();
    }
  };

  const assertWeightButtonsExist = (exist = true) => {
    const decrement = getDecrementWeightBtn();
    const increment = getIncrementWeightBtn();
    if (exist) {
      expect(decrement).toBeTruthy();
      expect(increment).toBeTruthy();
    } else {
      expect(decrement).toBeNull();
      expect(increment).toBeNull();
    }
  };

  const assertIsoButtonsExist = (exist = true) => {
    const decrement = getDecrementDurationBtn();
    const increment = getIncrementDurationBtn();
    if (exist) {
      expect(decrement).toBeTruthy();
      expect(increment).toBeTruthy();
    } else {
      expect(decrement).toBeNull();
      expect(increment).toBeNull();
    }
  };
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render bodyweight fields by default', () => {
    assertRepButtonsExist(true);
    assertWeightButtonsExist(false);
    assertIsoButtonsExist(false);
  });

  it('should switch to weighted set and show weight controls', async () => {
    await clickSetTypeOption('weight');
    fixture.detectChanges();

    expect(component.value().type).toBe('weight');
    assertRepButtonsExist(true);
    assertWeightButtonsExist(true);
    assertIsoButtonsExist(false);
  });

  it('should switch to iso set and show duration and weight controls', async () => {
    await clickSetTypeOption('iso');
    fixture.detectChanges();

    expect(component.value().type).toBe('iso');

    assertRepButtonsExist(false);
    assertWeightButtonsExist(true);
    assertIsoButtonsExist(true);
  });

  it('should increment reps', () => {
    getIncrementRepsBtn()?.click();
    fixture.detectChanges();

    expect(component.value().reps).toBe(2);
  });

  it('should decrement reps', () => {
    setValue({
      ...initialValue,
      reps: 3,
    });

    getDecrementRepsBtn()?.click();
    fixture.detectChanges();

    expect(component.value().reps).toBe(2);
  });

  it('should decrement reps but not below 1', () => {
    setValue({
      ...initialValue,
      reps: 1,
    });

    getDecrementRepsBtn()?.click();
    fixture.detectChanges();

    expect(component.value().reps).toBe(1);
  });

  it('should set reps using a quick option', () => {
    queryByTestId<HTMLButtonElement>('set-form-reps-8')?.click();
    fixture.detectChanges();

    expect(component.value().reps).toBe(8);
  });

  it('should increment weight when weighted controls are visible', () => {
    setValue({
      ...initialValue,
      type: 'weight',
      weight: 5,
    });

    getIncrementWeightBtn()?.click();
    getIncrementRepsBtn()?.click();
    fixture.detectChanges();

    expect(component.value().weight).toBe(6);
    expect(component.value().reps).toBe(2);
  });

  it('should increment weight using a quick option', () => {
    setValue({
      ...initialValue,
      type: 'weight',
      weight: 1,
    });

    queryByTestId<HTMLButtonElement>('set-form-weight-10')?.click();
    fixture.detectChanges();

    expect(component.value().weight).toBe(11);
  });

  it('should increment duration when isometric controls are visible', () => {
    setValue({
      ...initialValue,
      type: 'iso',
      duration: 10,
    });

    getIncrementDurationBtn()?.click();
    fixture.detectChanges();

    expect(component.value().duration).toBe(11);
  });

  it('should decrement duration', () => {
    setValue({
      ...initialValue,
      type: 'iso',
      duration: 10,
    });

    getDecrementDurationBtn()?.click();
    fixture.detectChanges();

    expect(component.value().duration).toBe(9);
  });

  it('should decrement duration but not below 1', () => {
    setValue({
      ...initialValue,
      type: 'iso',
      duration: 1,
    });

    getDecrementDurationBtn()?.click();
    fixture.detectChanges();

    expect(component.value().duration).toBe(1);
  });

  it('should increment duration using a quick option', () => {
    setValue({
      ...initialValue,
      type: 'iso',
      duration: 5,
    });

    queryByTestId<HTMLButtonElement>('set-form-duration-30')?.click();
    fixture.detectChanges();

    expect(component.value().duration).toBe(35);
  });

  test.each([
    {
      value: {
        type: 'weight',
        reps: 5,
        weight: 0,
        duration: 0,
      },
      message: 'weighted set has non-positive weight',
    },
    {
      value: {
        type: 'bodyweight',
        reps: 0,
        weight: 0,
        duration: 0,
      },
      message: 'reps are below minimum for bodyweight set',
    },
    {
      value: {
        type: 'iso',
        reps: 0,
        weight: 0,
        duration: 0,
      },
      message: 'duration is below minimum for isometric set',
    },
  ])('should be invalid when $message', ({ value }) => {
    setValue(value as SetData);
    expect(component.isInvalid()).toBe(true);
  });

  test.each([
    {
      value: {
        type: 'weight',
        reps: 5,
        weight: 1,
        duration: 0,
      },
      message: 'weighted set has a positive weight',
    },
    {
      value: {
        type: 'bodyweight',
        reps: 1,
        weight: 0,
        duration: 0,
      },
      message: 'reps are above minimum for bodyweight set',
    },
    {
      value: {
        type: 'iso',
        reps: 0,
        weight: 0,
        duration: 1,
      },
      message: 'duration is above minimum for isometric set',
    },
  ])('should be valid when $message', ({ value }) => {
    setValue(value as SetData);
    expect(component.isInvalid()).toBe(false);
  });
});
