import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { VideoMediaDto } from '../schema/media.schema';

@Injectable({ providedIn: 'root' })
export class SessionRepository extends GenericRepository<VideoMediaDto> {
  constructor() {
    super();
  }


}
