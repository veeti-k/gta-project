import {
  CardActions,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Paper,
} from "@material-ui/core/";

import { Delete } from "@material-ui/icons/";

import { useDispatch, useSelector } from "react-redux";

import { deleteCar } from "../../../actions/cars.js";
import {
  moveCar_checkCar,
  moveCar_checkErrorCar,
  moveCar_clear,
} from "../../../actions/moveCar.js";
import { newCar_checkChosenPossibleCar } from "../../../actions/newCar.js";

import { search } from "../../../actions/search.js";

const Car = ({ car, carType, onClick }) => {
  const dispatch = useDispatch();
  const carsToMove = useSelector((state) => state.moveCar.carsToMove);
  const isMoving = useSelector((state) => state.moveCar.isMoving);
  const errorCars = useSelector((state) => state.moveCar.errorCars);

  const searchInput = useSelector((state) => state.search.input);

  const checkMoveCar = (car) => {
    if (
      carType !== "moveCar" &&
      carType !== "search" &&
      carType !== "carsToMove"
    )
      return;

    if (carsToMove.length === 1 && isMoving) {
      return dispatch(moveCar_clear());
    }

    const errorCar = errorCars.find((errorCar) => (errorCar._id = car._id));

    if (errorCar) {
      dispatch(moveCar_checkErrorCar(errorCar));
    }

    dispatch(moveCar_checkCar(car));
  };

  const checkPossibleCar = (car) => {
    if (carType !== "possibleCar" && carType !== "chosenPossibleCar") return;

    dispatch(newCar_checkChosenPossibleCar(car));
  };

  let color;
  let elevation;

  elevation = 4;

  if (carsToMove.filter((one) => one._id === car._id).length) {
    color = "#181818";
  } else {
    color = "#212121";
  }

  if (carType.includes("chosen")) {
    color = "#181818";
    elevation = 1;
  }

  if (carType === "carsToMove") {
    color = "#181818";
    elevation = 1;
  }

  if (
    carType === "carsToMove" &&
    errorCars.filter((one) => one._id.toString() === car._id.toString()).length
  ) {
    color = "#b02828";
  }

  return (
    <div
      style={{ cursor: onClick ? "pointer" : null }}
      onClick={
        onClick
          ? () => {
              checkMoveCar(car);

              checkPossibleCar(car);
            }
          : null
      }
    >
      <Paper style={{ backgroundColor: color }} elevation={elevation}>
        <CardContent>
          <Grid container direction="column" alignItems="flex-start">
            <Typography variant="button" style={{ color: "white" }}>
              {car.manufacturer} - {car.name}
            </Typography>

            {carType === "possibleCar" ? (
              <Typography
                variant="button"
                style={{ color: "grey", fontSize: "0.7em" }}
              >
                {car.class}
              </Typography>
            ) : null}

            {carType === "search" || carType === "carsToMove" ? (
              <Typography
                variant="button"
                style={{ color: "grey", fontSize: "0.7em" }}
              >
                {car.garage.name}
                {car.garage.desc.length ? ` - ${car.garage.desc}` : ""}
              </Typography>
            ) : null}
          </Grid>
        </CardContent>
        {isMoving || carType !== "search" ? null : (
          <CardActions>
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={async (e) => {
                e.stopPropagation();
                await dispatch(deleteCar(car._id, searchInput));
                dispatch(search(searchInput));
              }}
            >
              <Delete />
            </IconButton>
          </CardActions>
        )}
      </Paper>
    </div>
  );
};

export default Car;
