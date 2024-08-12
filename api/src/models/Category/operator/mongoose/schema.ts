import mongoose, { Schema } from 'mongoose';
import { ICategoryData } from '../../types';

/**
 * Mongoose schema definition for `Category` model.
 */
const categorySchema = new Schema<ICategoryData>(
  {
    name: { type: String, required: true, index: { unique: true } },
    description: { type: String },
    statistics: {
      total_bulbs: { type: Number, min: 0 },
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
  }
);

/**
 * Mongoose implementation of `Category` model.
 */
export const CategoryModel = mongoose.model<ICategoryData>('Category', categorySchema);
