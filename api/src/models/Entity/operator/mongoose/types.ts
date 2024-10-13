import { HydratedDocument } from 'mongoose';

/**
 * The function type that extracts entity data out of a Mongoose document.
 */
export type IExtractDataFunction<EntityType> = (doc: HydratedDocument<EntityType>) => EntityType;

/**
 * The function type that loads a Mongoose document from the given document identifier.
 */
export type ILoadDocFunction<EntityType> = (id: string) => Promise<HydratedDocument<EntityType>>;
