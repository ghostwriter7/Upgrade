export abstract class Query<TResult = unknown> {
  declare readonly __result: TResult;
}
