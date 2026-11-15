import { Component, computed, ElementRef, model, output, signal, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donts-form',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
  ],
  templateUrl: './donts-form.html',
  styleUrl: './donts-form.css',
})
export class DontsForm {
  public create = output<string>();

  protected readonly value = signal('');
  protected readonly isInvalid = computed(() => this.value().trim().length === 0);
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public show(): void {
    this.dialogRef().nativeElement.showModal();
  }

  protected cancel(): void {
    this.dialogRef().nativeElement.close();
  }

  protected confirm(): void {
    const title = this.value().trim();

    if (title) {
      this.create.emit(title);
      this.value.set('');
      this.cancel();
    }
  }
}
