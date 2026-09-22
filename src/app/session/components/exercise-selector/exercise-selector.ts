import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { LibraryStore } from '@store/library.store';
import { Session } from '@domain/model/session/session.model';
import {
  MatDivider,
  MatListOption,
  MatListSubheaderCssMatStyler,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { PrintHoursPipe } from '@ui/pipes/print-hours-pipe';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatChipListbox, MatChipListboxChange, MatChipOption } from '@angular/material/chips';

@Component({
  selector: 'app-exercise-selector',
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatSelectionList,
    MatListOption,
    PrintHoursPipe,
    MatMiniFabButton,
    MatIcon,
    NgClass,
    MatDivider,
    MatListSubheaderCssMatStyler,
    MatChipOption,
    MatChipListbox,
  ],
  templateUrl: './exercise-selector.html',
  styleUrl: './exercise-selector.css',
  host: {
    'data-testid': 'exercise-selector',
  },
})
export class ExerciseSelector {
  private readonly data: { session: Session } = inject(MAT_DIALOG_DATA);
  private readonly libraryStore = inject(LibraryStore);

  protected readonly skillOptions = computed(() => [
    ...this.libraryStore.favouriteSkillsWithExercises(),
    ...this.libraryStore.remainingSkillsWithExercises(),
  ]);
  protected readonly activeSkill = linkedSignal<string | undefined>(
    () => this.data.session.skillId,
  );
  protected readonly hasNoneSelected = computed(() => this.selectedExerciseIds().length === 0);
  protected readonly selectedExerciseIds = signal<string[]>([]);
  private readonly activeExerciseIds = new Set(
    this.data.session.exerciseLogs.map(({ exerciseId }) => exerciseId),
  );
  private readonly availableExercises = computed(() => {
    const skillId = this.activeSkill();

    const exercises = (
      skillId
        ? (this.libraryStore.exerciseBySkillId().get(skillId) ?? [])
        : this.libraryStore.exercises()
    ).filter(({ id }) => !this.activeExerciseIds.has(id));

    const activeSort = this.sortOptions().find((option) => option.active)?.id;

    if (!activeSort) return exercises;
    const order = this.sortDirection() === 'ASC' ? 1 : -1;

    return exercises.sort((a, b) => {
      if (activeSort === 'alphabetical') return order * a.name.localeCompare(b.name);
      if (activeSort === 'last-performed-at') {
        const lastPerformedAtA = a.stats?.lastPerformedAt?.epochMilliseconds ?? 0;
        const lastPerformedAtB = b.stats?.lastPerformedAt?.epochMilliseconds ?? 0;
        return order * (lastPerformedAtA - lastPerformedAtB);
      }
      return 0;
    });
  });

  protected readonly exercises = computed(() =>
    Object.groupBy(this.availableExercises(), (exercise) =>
      exercise.isFavourite ? 'favourite' : 'remaining',
    ),
  );

  protected readonly showFilters = signal(false);
  protected readonly showSorting = signal(false);
  protected readonly sortOptions = signal([
    { icon: 'sort_by_alpha', id: 'alphabetical', active: true },
    { icon: 'history', id: 'last-performed-at', active: false },
  ]);
  protected readonly sortDirection = signal<'ASC' | 'DESC'>('DESC');
  protected readonly sortDirectionIcon = computed(() =>
    this.sortDirection() === 'ASC' ? 'arrow_upward' : 'arrow_downward',
  );

  protected handleSelectionChange(selectionListChange: MatSelectionListChange): void {
    this.selectedExerciseIds.set(
      selectionListChange.source.selectedOptions.selected.map((option) => option.value),
    );
  }

  protected toggleFilters(): void {
    this.showFilters.update((show) => !show);
  }

  protected toggleSorting(): void {
    this.showSorting.update((show) => !show);
  }

  protected toggleSortOption(activeIndex: number): void {
    this.sortOptions.update((sortOptions) =>
      sortOptions.map((option, index) => ({ ...option, active: index === activeIndex })),
    );
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update((dir) => (dir === 'ASC' ? 'DESC' : 'ASC'));
  }

  protected handleSkillChange({ value }: MatChipListboxChange): void {
    this.activeSkill.set(value);
  }
}
