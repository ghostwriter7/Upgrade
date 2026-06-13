import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCoverage } from './skill-coverage';
import { SkillCoverageService } from '@home/components/skill-coverage/service/skill-coverage.service';
import { Mock } from 'vitest';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { queryOptions } from '@home/components/skill-coverage/query-options.const';
import { getButtonToggle } from '@test/harness.utils';
import {
  MatCellHarness,
  MatHeaderCellHarness,
  MatTableHarness,
} from '@angular/material/table/testing';

describe('SkillCoverage', () => {
  let component: SkillCoverage;
  let fixture: ComponentFixture<SkillCoverage>;
  let skillCoverageServiceMock: { fetchCoverage: Mock };
  let loader: HarnessLoader;

  beforeEach(async () => {
    skillCoverageServiceMock = { fetchCoverage: vi.fn().mockResolvedValue([]) };
    await TestBed.configureTestingModule({
      imports: [SkillCoverage],
      providers: [{ provide: SkillCoverageService, useValue: skillCoverageServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillCoverage);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const getToggles = async () => {
    const toggleGroup = await loader.getHarness(MatButtonToggleGroupHarness);
    return toggleGroup.getToggles();
  };

  it('should render filter buttons', async () => {
    const toggles = await getToggles();

    const labels = await Promise.all(toggles.map((toggle) => toggle.getText()));

    expect(labels).toEqual(queryOptions.map(({ label }) => label));
  });

  test.each([
    { label: '7D', expectedValue: 7 },
    { label: '14D', expectedValue: 14 },
    { label: '30D', expectedValue: 30 },
    { label: '60D', expectedValue: 60 },
    { label: '90D', expectedValue: 90 },
    { label: '1Y', expectedValue: 365 },
  ])('should fetch skill coverage for a given quick filter', async ({ label, expectedValue }) => {
    const toggle = await getButtonToggle(loader, label);

    await toggle.check();

    expect(skillCoverageServiceMock.fetchCoverage).toHaveBeenCalledWith(expectedValue);
  });

  const assertCells = (cells: (MatCellHarness | MatHeaderCellHarness)[], expected: string[]) =>
    expect(Promise.all(cells.map((c) => c.getText()))).resolves.toEqual(expected);

  it('should render table rows', async () => {
    skillCoverageServiceMock.fetchCoverage.mockResolvedValue([
      { skill: 'side_splits', count: 5, daysAgo: 1 },
      { skill: 'front_splits', count: 3, daysAgo: 3 },
      { skill: 'shoulder_mobility', count: 0, daysAgo: -1 },
    ]);
    const table = await loader.getHarness(MatTableHarness);

    const rows = await table.getRows();

    expect(rows.length).toEqual(3);
    const [cells1, cells2, cells3] = await Promise.all(rows.map((r) => r.getCells()));

    await Promise.all([
      assertCells(cells1, ['Side Splits', '5', '1']),
      assertCells(cells2, ['Front Splits', '3', '3']),
      assertCells(cells3, ['Shoulder Mobility', '0', 'Never']),
    ]);

    const headerRows = await table.getHeaderRows();
    expect(headerRows.length).toBe(1);
    const headerCells = await headerRows[0].getCells()
    expect(headerCells.length).toBe(3);
    await assertCells(headerCells, ['Skill', 'Count', 'Days Ago'])
  });
});
