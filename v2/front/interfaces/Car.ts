import { IGarage } from "./Garage";

export interface ICar {
  id: string;
  name: string;
  garage: IGarage;
  manufacturer: string;
  price: number;
  class: string;
  reason?: string;
}

export interface ModelCar {
  name: string;
  manufacturer: string;
  price: number;
  class: string;
}
