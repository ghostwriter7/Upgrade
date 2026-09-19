import { Service } from '@angular/core';
import { Repository } from '@persistence/repository/repository';
import { TargetSchema } from '@persistence/schema/target.schema';
import { Target } from '@domain/model/target';

@Service()
export class TargetRepository extends Repository {
  constructor() {
    super();
  }

  public async getAllTargets(): Promise<Target[]> {
    const results = await super.queryMany(`
      select id, name, description, skill_id as skillId,
      weekly_commitment_in_minutes as weeklyCommitmentInMinutes,
      motivation, trade_offs as tradeOffs
      from target;
    `);
    return this.toDomain(results);
  }

  public save(target: Target): Promise<void> {
    return super.execute(
      `insert into target (id, name, description, skill_id, weekly_commitment_in_minutes, motivation, trade_offs)
       values (:id, :name, :description, :skillId, :weeklyCommitmentInMinutes, :motivation, :tradeOffs)`,
      {
        id: target.id,
        name: target.name,
        description: target.description,
        skillId: target.skillId,
        weeklyCommitmentInMinutes: target.weeklyCommitmentInMinutes,
        motivation: JSON.stringify(target.motivation),
        tradeOffs: JSON.stringify(target.tradeOffs),
      },
    );
  }

  public update(target: Target): Promise<void> {
    return super.execute(
      `update target
       set name                         = :name,
           description                  = :description,
           skill_id                     = :skillId,
           weekly_commitment_in_minutes = :weeklyCommitmentInMinutes,
           motivation                   = :motivation,
           trade_offs                   = :tradeOffs
       where id = :id`,
      {
        id: target.id,
        name: target.name,
        description: target.description,
        skillId: target.skillId,
        weeklyCommitmentInMinutes: target.weeklyCommitmentInMinutes,
        motivation: JSON.stringify(target.motivation),
        tradeOffs: JSON.stringify(target.tradeOffs),
      },
    );
  }

  public deleteById(targetId: string): Promise<void> {
    return super.execute(`delete from target where id = :id`, { id: targetId });
  }

  private toDomain(results: unknown[]): Target[] {
    return Iterator.from(results)
      .map((result) => TargetSchema.parse(result))
      .toArray();
  }
}
