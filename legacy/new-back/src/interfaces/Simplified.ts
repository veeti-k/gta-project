import { ObjectId } from "mongoose";

export interface SimplifiedCar {
  id: ObjectId;
  name: string;
  manufacturer: string;
  price: number;
  class: string;
  owner: string;
  garage: {
    id: ObjectId;
    name: string;
    desc: string;
    type: string;
    capacity: number;
    amountOfCars: number;
  };
}

export interface SimplifiedGarageDeep {
  id: ObjectId;
  modelId: ObjectId;
  name: string;
  desc: string;
  cars: SimplifiedCar[];
  capacity: number;
  amountOfCars: number;
  room: number;
  type: string;
  owner: string;
  full: boolean;
}

export interface SimplifiedGarage {
  id: ObjectId;
  modelId: ObjectId;
  name: string;
  desc: string;
  capacity: number;
  amountOfCars: number;
  room: number;
  type: string;
  owner: string;
  full: boolean;
}

export interface SimplifiedUser {
  id: ObjectId;
  owner: string;
  email: string;
  cars: (SimplifiedCar | null)[] | null;
  garages: (SimplifiedGarage | null)[] | null;
  carCount: number;
  garageCount: number;
}

export interface SimplifiedModelCar {
  id: ObjectId;
  name: string;
  manufacturer: string;
  price: number;
  class: string;
}

export interface SimpliefiedModelGarage {
  id: ObjectId;
  name: string;
  capacity: number;
  type: string;
  alreadyOwned: boolean;
}
