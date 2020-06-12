export interface Factory<ObjectToCreate, RawObject = unknown> {
  create(raw: RawObject): ObjectToCreate | Promise<ObjectToCreate>;
  createBulk?(raw: RawObject[]): ObjectToCreate[] | Promise<ObjectToCreate[]>;
}
