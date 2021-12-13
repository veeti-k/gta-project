import { ObjectId } from "mongoose";

export interface SimplifiedCar {
  id: ObjectId;
  name: string;
  manufacturer: string;
  price: number;
  class: string;
  owner: string;
  garage: {
    name: string;
    desc: string;
    type: string;
    capacity: number;
    amountOfCars: number;
  };
}

export interface SimplifiedGarage {
  id: ObjectId;
  name: string;
  desc: string;
  capacity: number;
  type: string;
  amountOfCars: number;
  owner: string;
}
