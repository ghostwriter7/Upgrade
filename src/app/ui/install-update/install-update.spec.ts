import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallUpdate } from './install-update';
import { Subject } from 'rxjs';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { getButtonByTestId } from '@test/harness.utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('InstallUpdate', () => {
  let versionEvents: Subject<VersionEvent>;
  let component: InstallUpdate;
  let fixture: ComponentFixture<InstallUpdate>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    versionEvents = new Subject();
    await TestBed.configureTestingModule({
      imports: [InstallUpdate],
      providers: [{ provide: SwUpdate, useValue: { versionUpdates: versionEvents } }],
    }).compileComponents();

    fixture = TestBed.createComponent(InstallUpdate);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const button = () => getButtonByTestId(loader, 'install-update-btn');

  it('should not display the button by default', async () => {
    const button = await loader.getHarnessOrNull(MatButtonHarness);

    expect(button).toBeNull();
  });

  it('should display the button if the VERSION_READY event is emitted', async () => {
    versionEvents.next({ type: 'VERSION_READY' } as VersionEvent);

    await expect(button()).resolves.toBeDefined();
  });

  it('should not display the button if irrelevant event is emitted', async () => {
    versionEvents.next({ type: 'NO_NEW_VERSION_DETECTED' } as VersionEvent);

    const button = await loader.getHarnessOrNull(MatButtonHarness);

    expect(button).toBeNull();
  });
});
