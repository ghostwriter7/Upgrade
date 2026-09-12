import { Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { CommandBus } from '@common/routers/command/command-bus';
import { UpdateSessionRpeCommand } from '@session/commands/update-session-rpe/update-session-rpe.command';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rpe-input',
  imports: [MatSlider, MatSliderThumb, ReactiveFormsModule],
  templateUrl: './rpe-input.html',
  styleUrl: './rpe-input.css',
})
export class RpeInput implements OnInit {
  public rpe = input<number | null>(null);
  public isEditable = input.required<boolean>();

  protected readonly isDisabled = computed(() => !this.isEditable());
  private readonly commandBus = inject(CommandBus);
  protected readonly control = new FormControl<number | undefined>(undefined);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly value = toSignal(this.control.valueChanges);
  protected readonly valueClasses = computed(() => {
    const value = this.value();
    if (!value) return 'label';

    if (value < 3) return ['label', 'label--very-soft'];
    if (value < 5) return ['label', 'label--soft'];
    if (value < 7) return ['label', 'label--mid'];
    if (value < 9) return ['label', 'label--hard'];
    return ['label', 'label--very-hard'];
  });

  public ngOnInit(): void {
    this.control.setValue(this.rpe());

    this.control.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((value) => (value === null ? undefined : value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.commandBus.dispatch(new UpdateSessionRpeCommand(value)));
  }
}
