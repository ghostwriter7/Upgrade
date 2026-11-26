import {
  Component,
  OnInit,
  WritableSignal,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ExerciseRowComponent } from './exercise-row.component';
import {
  AddExercisesConfig,
  DEFAULT_ADD_EXERCISES_CONFIG,
  ExerciseGroup,
  ExerciseOption,
  SortDirection,
  SortKey,
} from './add-exercises.models';
import { compareVm, formatLastDone, groupRows, matchesTokens, queryTokens, toViewModel } from './add-exercises.utils';
import {
  EXERCISE_TYPE_LABELS,
  EXERCISE_TYPES,
  ExerciseType,
} from '@domain/enum/exercise-types.enum';
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface SortOption {
  readonly key: SortKey;
  readonly label: string;
  readonly asc: string;
  readonly desc: string;
}

/**
 * "Add exercises" bottom-sheet content: search, quick and advanced filters,
 * sort, a recency-grouped list, and a confirm bar.
 *
 * It fills its container (height: 100%). Presenting it (scrim, slide-up
 * animation, dialog or route) is the host's job.
 *
 * Usage:
 *   <app-add-exercises
 *     [exercises]="exercises()"
 *     (confirmed)="onAdd($event)"
 *     (cancelled)="closeSheet()"
 *     (createRequested)="openCreateForm($event)" />
 */
@Component({
  selector: 'app-add-exercises',
  imports: [
    ExerciseRowComponent,
    MatButton,
    MatFabButton,
    MatIcon,
    MatMiniFabButton,
    MatIconButton,
  ],
  templateUrl: './add-exercises.component.html',
  styleUrl: './add-exercises.component.css',
  host: { '(keydown.escape)': 'closeMenus()' },
})
export class AddExercisesComponent implements OnInit {
  /* ------------------------------ inputs ------------------------------ */

  /** Every exercise the user can pick from. */
  readonly exercises = input.required<readonly ExerciseOption[]>();

  /** Ids ticked when the view opens, in session order. Read once on init. */
  readonly initialSelectedIds = input<readonly string[]>([]);

  /** Optional thresholds; see AddExercisesConfig. */
  readonly config = input<Partial<AddExercisesConfig>>({});

  /* ------------------------------ outputs ----------------------------- */

  /** "Add n exercises" tapped. Emits the chosen exercises in the order they were ticked. */
  readonly confirmed = output<readonly ExerciseOption[]>();

  /** Cancel button or close icon tapped. */
  readonly cancelled = output<void>();

  /* ------------------------------ state ------------------------------- */

  protected readonly query = signal('');
  protected readonly onlyFavourites = signal(false);
  protected readonly onlyRecent = signal(false);
  protected readonly onlyOverdue = signal(false);
  protected readonly types = signal<ReadonlySet<ExerciseType>>(new Set());
  protected readonly muscles = signal<ReadonlySet<string>>(new Set());
  protected readonly equipment = signal<ReadonlySet<string>>(new Set());

  protected readonly sortKey = signal<SortKey>('lastDone');
  protected readonly sortLabel = computed(() =>
    this.sortKey() === 'lastDone' ? 'Last done' : 'Name',
  );
  protected readonly sortDir = signal<SortDirection>('asc');
  protected readonly isDescending = computed(() => this.sortDir() === 'desc');

  protected readonly advancedOpen = signal(false);
  protected readonly sortMenuOpen = signal(false);

  /** Ordered: position in the array is the position in the session. */
  protected readonly selectedIds = signal<readonly string[]>([]);

  /** Captured once, so "x days ago" is stable while the sheet is open. */
  private readonly nowMs = Date.now();

  protected readonly typeLabels = EXERCISE_TYPE_LABELS;
  protected readonly sortOptions: readonly SortOption[] = [
    { key: 'lastDone', label: 'Last done', asc: 'Longest ago first', desc: 'Most recent first' },
    { key: 'name', label: 'Name', asc: 'A to Z', desc: 'Z to A' },
  ];

  /* ----------------------------- derived ------------------------------ */

  private readonly cfg = computed<AddExercisesConfig>(() => ({
    ...DEFAULT_ADD_EXERCISES_CONFIG,
    ...this.config(),
  }));

  private readonly items = computed(() => this.exercises().map((e) => toViewModel(e, this.nowMs)));

  private readonly byId = computed(() => new Map(this.exercises().map((e) => [e.id, e] as const)));

  protected readonly availableTypes = computed(() => {
    const present = new Set(this.exercises().map((e) => e.type));
    return EXERCISE_TYPES.filter((t) => present.has(t));
  });

  protected readonly availableMuscles = computed(() =>
    this.distinct(this.exercises().flatMap((e) => e.muscleGroups ?? [])),
  );
  protected readonly availableEquipment = computed(() =>
    this.distinct(this.exercises().flatMap((e) => e.equipment ?? [])),
  );
  protected readonly hasAdvancedFilters = computed(
    () => this.availableMuscles().length > 0 || this.availableEquipment().length > 0,
  );

  /** Badge on the filter button: only the advanced selections count. */
  protected readonly advancedCount = computed(() => this.muscles().size + this.equipment().size);

  protected readonly hasActiveFilters = computed(
    () =>
      this.query().trim() !== '' ||
      this.onlyFavourites() ||
      this.onlyRecent() ||
      this.onlyOverdue() ||
      this.types().size > 0 ||
      this.advancedCount() > 0,
  );

  private readonly filtered = computed(() => {
    const { recentDays, overdueDays } = this.cfg();
    const tokens = queryTokens(this.query());
    const favourites = this.onlyFavourites();
    const recent = this.onlyRecent();
    const overdue = this.onlyOverdue();
    const types = this.types();
    const muscles = this.muscles();
    const equipment = this.equipment();
    const anyOf = (wanted: ReadonlySet<string>, have: readonly string[] | undefined) =>
      wanted.size === 0 || (have ?? []).some((v) => wanted.has(v));

    return this.items().filter(
      (vm) =>
        matchesTokens(vm.searchText, tokens) &&
        (!favourites || vm.exercise.isFavourite) &&
        (!recent || (vm.days !== null && vm.days <= recentDays)) &&
        (!overdue || (vm.days !== null && vm.days > overdueDays)) &&
        (types.size === 0 || types.has(vm.exercise.type)) &&
        anyOf(muscles, vm.exercise.muscleGroups) &&
        anyOf(equipment, vm.exercise.equipment),
    );
  });

  protected readonly resultCount = computed(() => this.filtered().length);
  protected readonly resultLabel = computed(() => {
    const count = this.resultCount();
    return `${count} ${count === 1 ? 'result' : 'results'}`;
  });

  protected readonly groups = computed<ExerciseGroup[]>(() => {
    const key = this.sortKey();
    const dir = this.sortDir();
    const sorted = [...this.filtered()].sort((a, b) => compareVm(a, b, key, dir));
    return groupRows(sorted, key, this.cfg().overdueDays);
  });

  protected readonly lastDoneText = (days: number | null) => formatLastDone(days);
  protected readonly isOverdue = (days: number | null) =>
    days !== null && days > this.cfg().overdueDays;

  protected readonly sortPillLabel = computed(() => {
    const opt = this.sortOptions.find((o) => o.key === this.sortKey())!;
    return `Sort by ${opt.label.toLowerCase()}, ${this.sortDir() === 'asc' ? opt.asc : opt.desc}`;
  });

  /* ---------------------------- selection ----------------------------- */

  protected readonly selectedOrder = computed(
    () => new Map(this.selectedIds().map((id, i) => [id, i + 1] as const)),
  );

  /** Selected ids that still exist in `exercises`, in order. */
  private readonly selectedExercises = computed(() =>
    this.selectedIds()
      .map((id) => this.byId().get(id))
      .filter((e): e is ExerciseOption => e !== undefined),
  );

  protected readonly selectedCount = computed(() => this.selectedExercises().length);
  protected readonly hasAnySelected = computed(() => this.selectedCount() > 0);
  protected readonly selectedNames = computed(() =>
    this.selectedExercises()
      .map((e) => e.name)
      .join(', '),
  );
  protected readonly addLabel = computed(() => {
    const count = this.selectedCount();
    if (!count) return 'Add';
    if (count === 1) return 'Add 1 exercise';
    return `Add ${count} exercises`;
  });

  ngOnInit(): void {
    this.selectedIds.set([...this.initialSelectedIds()]);
  }

  /* ----------------------------- handlers ----------------------------- */

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggleFavourites(): void {
    this.onlyFavourites.update((v) => !v);
  }

  /** Recent and Overdue contradict each other, so turning one on turns the other off. */
  protected toggleRecent(): void {
    this.onlyRecent.update((v) => !v);
    if (this.onlyRecent()) this.onlyOverdue.set(false);
  }

  protected toggleOverdue(): void {
    this.onlyOverdue.update((v) => !v);
    if (this.onlyOverdue()) this.onlyRecent.set(false);
  }

  protected toggleType(type: ExerciseType): void {
    this.toggleInSet(this.types, type);
  }

  protected toggleMuscle(name: string): void {
    this.toggleInSet(this.muscles, name);
  }

  protected toggleEquipment(name: string): void {
    this.toggleInSet(this.equipment, name);
  }

  protected clearFilters(): void {
    this.query.set('');
    this.onlyFavourites.set(false);
    this.onlyRecent.set(false);
    this.onlyOverdue.set(false);
    this.types.set(new Set());
    this.muscles.set(new Set());
    this.equipment.set(new Set());
  }

  protected toggleSortMenu(): void {
    this.sortMenuOpen.update((v) => !v);
  }

  /** Picking the active option flips its direction; picking another starts ascending. */
  protected chooseSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.sortMenuOpen.set(false);
  }

  protected closeMenus(): void {
    this.sortMenuOpen.set(false);
  }

  protected toggleSelected(id: string): void {
    this.selectedIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  protected clearSelection(): void {
    this.selectedIds.set([]);
  }

  protected confirm(): void {
    const chosen = this.selectedExercises();
    if (chosen.length > 0) this.confirmed.emit(chosen);
  }

  /* ------------------------------ helpers ----------------------------- */

  private toggleInSet<T>(target: WritableSignal<ReadonlySet<T>>, value: T): void {
    target.update((current) => {
      const next = new Set(current);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  private distinct(values: readonly string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }
}
