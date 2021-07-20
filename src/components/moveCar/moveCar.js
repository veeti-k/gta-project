import React from "react";

import { Card, CardContent, Typography, Grid, Button } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { move, forceIsMoving } from "../../actions/moveCar";
import { search } from "../../actions/search.js";
import { setGarageInput, setNewGarageId } from "../../actions/garages.js";

import { clearMoveList } from "../../actions/moveCar.js";

import Cars from "../cars/cars.js";
import SelectGarage from "../garages/selectGarage.js";

const MoveCar = () => {
  const dispatch = useDispatch();

  const carsToMove = useSelector((state) => state.carsToMove);
  const newGarageId = useSelector((state) => state.newGarageId);

  const searchInput = useSelector((state) => state.searchInput);

  return (
    <>
      <Card
        style={{ backgroundColor: "#212121", marginBottom: "7.5px" }}
        variant="outlined"
      >
        <CardContent>
          <Grid container direction="column" style={{ gridRowGap: "10px" }}>
            <Typography
              variant="body1"
              style={{
                color: "white",
                paddingBottom: "10px",
                fontSize: "20px",
              }}
            >
              Move
            </Typography>
            <SelectGarage paddingBottom={"10px"} />
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={newGarageId ? false : true}
              onClick={async () => {
                await dispatch(move(carsToMove, newGarageId));
                dispatch(setGarageInput(""));
                dispatch(setNewGarageId(null));
                dispatch(search(searchInput));
                dispatch(forceIsMoving(false));
              }}
            >
              {carsToMove.length > 1
                ? `Move ${carsToMove.length} cars`
                : `Move ${carsToMove.length} car`}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={async () => {
                dispatch(clearMoveList());
                dispatch(setGarageInput(""));
                dispatch(forceIsMoving(false));
              }}
            >
              Clear cars
            </Button>

            <Cars cars={carsToMove} onClick={true} page={"move_car"} />
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default MoveCar;
