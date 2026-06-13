import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Content } from '../content/content';
import { RouterLink } from '@angular/router';
import { InstallUpdate } from '@ui/install-update/install-update';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    Content,
    RouterLink,
    InstallUpdate,
  ],
})
export class LayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
  );
  protected readonly role = computed(() => (this.isHandset() ? 'dialog' : 'navigation'));
  protected readonly mode = computed(() => (this.isHandset() ? 'over' : 'side'));
  protected readonly isOpen = computed(() => !this.isHandset());
}
