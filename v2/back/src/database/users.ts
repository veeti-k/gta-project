import { ObjectId } from "mongoose";
import { Auth } from "../interfaces/Auth";
import { mongo } from "../mongo";

export const add = {
  car: async (carId: ObjectId, auth: Auth) => {
    return await mongo.users.add.car(carId, auth.userId, auth.dbId);
  },

  garage: async (garageId: ObjectId, auth: Auth) => {
    return await mongo.users.add.garage(garageId, auth.userId, auth.dbId);
  },

  user: async (owner: string, email: string) => {
    return await mongo.users.add.user(owner, email);
  },
};

export const remove = {
  car: async (carId: ObjectId, auth: Auth) => {
    return await mongo.users.remove.car(carId, auth.userId, auth.dbId);
  },

  garage: async (garageId: ObjectId, auth: Auth) => {
    return await mongo.users.remove.garage(garageId, auth.userId, auth.dbId);
  },
};

export const get = async (owner: string, email: string): Promise<ObjectId> => {
  const newUser = await mongo.users.get(owner, email);

  return newUser._id;
};