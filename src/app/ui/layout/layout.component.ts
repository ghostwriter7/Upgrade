import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Content } from '../content/content';
import { RouterLink } from '@angular/router';
import { InstallUpdate } from '@ui/install-update/install-update';
import { TabBar } from '@ui/tab-bar/tab-bar';
import { EventService } from '@common/service/event/event.service';
import { SwipedEvent } from '@common/events/swiped.event';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    Content,
    RouterLink,
    InstallUpdate,
    TabBar,
  ],
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'cancelSwipe()',
  },
})
export class LayoutComponent {
  private readonly swipeThreshold = 60;
  private swipeStart: { pointerId: number; x: number; y: number } | null = null;
  private readonly eventService = inject(EventService);

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'touch') {
      return;
    }

    if (!event.isPrimary) {
      this.cancelSwipe();
      return;
    }

    this.swipeStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  }

  protected onPointerUp(event: PointerEvent): void {
    const start = this.swipeStart;

    if (event.pointerId !== start?.pointerId) {
      return;
    }

    this.cancelSwipe();

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) < this.swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) {
      return;
    }

    if (deltaX < 0) {
      this.eventService.dispatch(SwipedEvent.right())
    } else {
      this.eventService.dispatch(SwipedEvent.left())
    }
  }

  protected cancelSwipe(): void {
    this.swipeStart = null;
  }
}
