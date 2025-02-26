import mongoose, { Schema } from 'mongoose';
import { IReferenceSourceData, ReferenceSourceTypes } from '../../types';

/**
 * Mongoose schema definition for `ReferenceSource` model.
 */
const referenceSourceSchema = new Schema<IReferenceSourceData>(
  {
    name: { type: String, required: true, index: { unique: true } },
    type: { type: String, required: true, enum: ReferenceSourceTypes },
    locator: { type: String },
    image_url: { type: String },
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
 * Mongoose implementation of `ReferenceSource` model.
 */
export const ReferenceSourceModel = mongoose.model<IReferenceSourceData>('ReferenceSource', referenceSourceSchema);
