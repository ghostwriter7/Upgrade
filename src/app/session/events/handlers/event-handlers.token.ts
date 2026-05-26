import { InjectionToken } from '@angular/core';
import { EventHandler } from './event-handler.interface';

export const EVENT_HANDLERS = new InjectionToken<EventHandler[]>('EVENT_HANDLERS');
