import { inject, Service } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Service()
export class IconRegistry {
  private static readonly ICONS = [
    'bridge',
    'dance',
    'front_split',
    'handstand',
    'one_arm_chin_up',
    'pancake',
    'pike',
    'shoulder_mobility',
    'side_split',
  ];

  constructor() {
    const registry = inject(MatIconRegistry);
    const domSanitizer = inject(DomSanitizer);
    for (const icon of IconRegistry.ICONS) {
      registry.addSvgIcon(icon, domSanitizer.bypassSecurityTrustResourceUrl(`/icons/${icon}.svg`));
    }
  }
}
