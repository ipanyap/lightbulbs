import mongoose, { Schema } from 'mongoose';
import { IRawBulbData } from './types';

/**
 * Mongoose schema definition for `Bulb` model.
 */
const bulbSchema = new Schema<IRawBulbData>(
  {
    title: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    content: { type: String, required: true },
    references: [
      {
        source_id: { type: Schema.Types.ObjectId, ref: 'ReferenceSource' },
        detail: { type: String },
      },
    ],
    tag_ids: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    past_versions: [
      {
        archived_at: { type: Date, required: true },
        content: { type: String, required: true },
      },
    ],
    deleted_at: { type: Date },
  },
  {
    // Throw errors when the data saved contains additional fields not specified in the schema.
    strict: 'throw',
    // Disable auto creating a collection when it does not exist.
    autoCreate: false,
    // Ensure there are no other concurrent updates between the time a client querying and submitting its update.
    optimisticConcurrency: true,
    // Apply automatic create & update timestamps and customize the names.
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

/**
 * Mongoose implementation of `Bulb` model.
 */
export const BulbModel = mongoose.model<IRawBulbData>('Bulb', bulbSchema);
