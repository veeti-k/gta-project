import { PopulatedCar } from "../models/car";
import { PopulatedGarage } from "../models/garage";
import { ModelCar } from "../models/ModelCar";
import { IdModelGarage } from "../models/ModelGarage";
import { PopulatedUser } from "../models/user";

export const isModelCar = (obj: ModelCar | any): obj is ModelCar => {
  return obj && obj.name && typeof obj.name === "string";
};

export const isPopulatedGarage = (obj: PopulatedGarage | any): obj is PopulatedGarage => {
  return obj && obj.desc !== undefined && typeof obj.desc === "string";
};

export const isIdModelGarage = (obj: IdModelGarage | any): obj is IdModelGarage => {
  return obj && obj.name && typeof obj.name === "string";
};

export const isPopulatedUser = (obj: PopulatedUser | any): obj is PopulatedUser => {
  return obj && obj.owner && typeof obj.owner === "string";
};

export const isPopulatedCar = (
  obj: PopulatedCar[] | any[],
  amountOfCars: number
): obj is PopulatedCar[] => {
  if (obj && Array.isArray(obj) && !obj.length && amountOfCars === 0) return true;
  return obj && obj[0] && obj[0].modelCar.name && typeof obj[0].modelCar.name === "string";
};
