import React, { useEffect } from "react";

import { useParams, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@material-ui/core";

import {
  renameGarage,
  getCarsForGarage,
  clearGarage,
  garagePageSetName,
  garagePageSetDesc,
  searchGarages,
} from "../../actions/garages.js";

import { search } from "../../actions/search.js";

const GaragePage = () => {
  const dispatch = useDispatch();
  let { gID } = useParams();

  useEffect(() => {
    dispatch(getCarsForGarage(gID));
  }, [dispatch, gID]);

  const {
    garageName,
    garageDesc,
    garage_id,
    garageDescInput,
    garageNameInput,
    cars,
  } = useSelector((state) => state.garagePage);

  const searchInput = useSelector((state) => state.searchInput);
  const garageInput = useSelector((state) => state.garageInput);

  return (
    <>
      <Grid container direction="column" style={{ gridRowGap: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/home"
          onClick={() => {
            dispatch(clearGarage());
            if (garageInput) {
              dispatch(searchGarages(garageInput));
            }
            if (searchInput) {
              dispatch(search(searchInput));
            }
          }}
        >
          Back
        </Button>
        <Card style={{ backgroundColor: "#212121" }}>
          <CardContent>
            <Grid container direction="column" style={{ gridRowGap: "10px" }}>
              <Typography
                variant="button"
                style={{ color: "white", fontSize: "18px" }}
              >
                rename garage
              </Typography>
              <input
                type="text"
                value={garageNameInput}
                placeholder={garageName}
                onChange={(e) => dispatch(garagePageSetName(e.target.value))}
                style={{
                  backgroundColor: "#212121",
                  outline: "none",
                  border: "none",
                  color: "white",
                  fontSize: "24px",
                }}
              ></input>
              <input
                type="text"
                value={garageDescInput}
                placeholder={garageDesc}
                onChange={(e) => dispatch(garagePageSetDesc(e.target.value))}
                style={{
                  backgroundColor: "#212121",
                  outline: "none",
                  border: "none",
                  color: "white",
                  fontSize: "24px",
                }}
              ></input>
            </Grid>
            <Grid container direction="row" style={{ paddingTop: "5px" }}>
              <Typography
                variant="button"
                style={{ color: "white", fontSize: "18px" }}
              >
                {cars.length > 0
                  ? cars.length > 1
                    ? `${cars.length} cars`
                    : `${cars.length} car`
                  : `${cars.length} cars`}
              </Typography>
            </Grid>
          </CardContent>

          <CardActions>
            <Grid container direction="column">
              <Button
                disabled={
                  (garageNameInput.length && garageNameInput !== garageName) ||
                  garageDescInput !== garageDesc
                    ? false
                    : true
                }
                variant="contained"
                color="primary"
                onClick={(e) => {
                  dispatch(
                    renameGarage(
                      garageNameInput,
                      garageDescInput,
                      garage_id,
                      searchInput
                    )
                  );
                }}
              >
                Rename
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};

export default GaragePage;
