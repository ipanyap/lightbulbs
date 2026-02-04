import mongoose, { Schema } from 'mongoose';
import { IRawTagData } from './types';

/**
 * Mongoose schema definition for `Tag` model.
 */
const tagSchema = new Schema<IRawTagData>(
  {
    label: { type: String, required: true, index: { unique: true } },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Tag' },

    description: { type: String },
    statistics: {
      total_bulbs: { type: Number, min: 0 },
      total_children: { type: Number, min: 0 },
    },
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
    // Unique index is needed to prevent duplicates, updating index needs to be immediate
    autoIndex: true,
  }
);

/**
 * Mongoose implementation of `Tag` model.
 */
export const TagModel = mongoose.model<IRawTagData>('Tag', tagSchema);
