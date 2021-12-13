import { Car } from "../interfaces/Car";
import { Garage } from "../interfaces/Garage";

export interface InitState {
  search: {
    input: {
      value: string;
      isEmpty: boolean;
    };

    cars: {
      cars: Car[];
    };

    garages: {
      garages: Garage[];
    };

    api: {
      loading: boolean | null;
      error: boolean | null;
      notFound: boolean | null;
    };
  };
}

export const initState = {
  search: {
    input: {
      value: "",
      isEmpty: true,
    },

    cars: [],
    garages: [],

    api: {
      loading: null,
      error: null,
      notFound: null,
    },
  },
};