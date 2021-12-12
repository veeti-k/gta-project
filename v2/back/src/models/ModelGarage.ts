import mongoose from "mongoose";

export interface ModelGarage {
  name: string;
  capacity: number;
  type: string;
}

export interface ModelGarageDoc extends mongoose.Document, ModelGarage {}

const schema: mongoose.Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { collection: "model-garages" }
);

export const ModelGarageModel = mongoose.model<ModelGarageDoc>("modelgarage", schema);
