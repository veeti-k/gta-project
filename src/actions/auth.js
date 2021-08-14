import { LOGIN, LOGOUT, SET_LOGGED_IN } from "../constants/actionTypes";

import axios from "axios";

const config = require(".././config.json");

export const login = (token) => async (dispatch) => {
  await axios
    .post(`${config.API_URL}/gta-api/auth/login`, {
      token,
    })
    .then((response) => {
      dispatch({
        type: LOGIN,
      });
    })
    .catch((error) => {
      if (error.response.status === 401) {
        console.log("invalid token");
      }
      if (error.response.status === 500) {
        console.log("server error");
      }
    });
};

export const checkLogin = () => async (dispatch) => {
  await axios
    .get(`${config.API_URL}/gta-api/check/login`)
    .then((res) => {
      dispatch({ type: SET_LOGGED_IN, payload: true });
    })
    .catch((err) => {
      console.log("not logged in");
    });
};

export const logout = () => async (dispatch) => {
  await axios.delete(`${config.API_URL}/gta-api/auth/logout`).then((res) => {
    dispatch({ type: LOGOUT });
  });
};

export const setLoggedIn = (value) => {
  return { type: SET_LOGGED_IN, payload: value };
};
