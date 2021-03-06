import mongoose, { ObjectId } from "mongoose";
import { ModelCar } from "./ModelCar";

export interface Car {
  modelCar: ObjectId;
  garage: ObjectId;
  owner: ObjectId;
}

export interface IdCar {
  _id: ObjectId;
  modelCar: ObjectId;
  garage: ObjectId;
  owner: ObjectId;
}

export interface PopulatedCar {
  _id: ObjectId;
  modelCar: ModelCar;
  garage: ObjectId;
  owner: ObjectId;
}

export interface CarDoc extends mongoose.Document, Car {}

const schema: mongoose.Schema = new mongoose.Schema(
  {
    modelCar: { type: mongoose.Schema.Types.ObjectId, ref: "modelcar", required: true },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: "garage", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { collection: "cars", timestamps: true }
);

export const CarModel = mongoose.model<CarDoc>("car", schema);
