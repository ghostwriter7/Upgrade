import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export const query = <E, T = any>(fixture: ComponentFixture<T>, selector: string) =>
  fixture.debugElement.query(By.css(selector))?.nativeElement as E | undefined;

export const queryByTestId = <E, T = any>(fixture: ComponentFixture<T>, testId: string) =>
  query<E>(fixture, `[data-testid=${testId}]`);
