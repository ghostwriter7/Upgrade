import { InjectionToken } from '@angular/core';
import { CommandHandler } from './command-handler.interface';

export const COMMAND_HANDLERS = new InjectionToken<CommandHandler[]>('COMMAND_HANDLER')
