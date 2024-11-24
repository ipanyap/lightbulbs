import { HydratedDocument } from 'mongoose';

/**
 * The function type that extracts entity data out of a Mongoose document.
 */
export type IExtractDataFunction<EntityType, RawEntityType = EntityType> = (
  doc: HydratedDocument<RawEntityType>
) => EntityType;

/**
 * The function type that injects entity data into a Mongoose document.
 */
export type IInjectDataFunction<EntityType, RawEntityType = EntityType> = (
  data: Partial<EntityType>,
  doc: HydratedDocument<RawEntityType>
) => void;

/**
 * The function type that loads a Mongoose document from the given document identifier.
 */
export type ILoadDocFunction<RawEntityType> = (id: string) => Promise<HydratedDocument<RawEntityType>>;
