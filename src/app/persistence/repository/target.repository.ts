import { Service } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { StoreName } from '@persistence/repository/store-name.enum';
import { TargetDto, TargetSchema } from '@persistence/schema/target.schema';
import { Target } from '@domain/model/target';

@Service()
export class TargetRepository extends GenericRepository<TargetDto> {
  constructor() {
    super();
  }

  public async getAllTargets(): Promise<Target[]> {
    const targets = await super.findAll(StoreName.TARGETS);
    return targets.map((target) => TargetSchema.parse(target));
  }

  public save(target: Target): Promise<IDBValidKey> {
    return super.put(StoreName.TARGETS, TargetSchema.encode(target));
  }

  public deleteById(targetId: string): Promise<void> {
    return super.delete(StoreName.TARGETS, targetId);
  }
}
