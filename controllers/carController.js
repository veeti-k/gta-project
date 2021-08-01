import { carModel, garageModel, possibleCarModel } from "../models";
import { getUniqueCarId, getGarageById } from "../helpers/carHelpers.js";

const time = new Date();

export const newCar = async (req, res, next) => {
  // Adds a car
  try {
    const newCarName = req.body.name.toLowerCase();
    const newGarageId = req.body.garageID;
    const owner = req.session.userId;

    const garage = await garageModel.findOne({
      owner: owner,
      ID: newGarageId,
    });

    if (!garage)
      return res.status(204).json({ message: "that garage doesn't exist" });

    let modelCar = await possibleCarModel.findOne(
      { name: newCarName },
      "-_id -__v"
    );

    if (!modelCar)
      return res.status(204).json({
        message: "that car doesn't exist",
      });

    const carID = await getUniqueCarId(owner);

    let complete = await carModel.create({
      name: modelCar.name,
      manufacturer: modelCar.manufacturer,
      price: modelCar.price,
      class: modelCar.class,
      ID: carID,
      garage: {
        name: garage.name,
        desc: garage.desc,
        ID: garage.ID,
      },
      owner: owner,
    });

    complete.save((err, car) => {
      if (err) {
        res.status(500).json({ error: `Error saving a new car` });
        return console.log(`Error saving a new car: \n\n${err}`);
      }

      res.status(201).json(car);

      console.log(
        `\n@ ${time.toLocaleDateString()} - ${time.toLocaleTimeString()}\n  Car added\n    ${
          car.name
        }\n    ${car.garage.name} - ${car.garage.desc} - ${
          car.garage.ID
        }\n    ${owner}`
      );
    });
  } catch (err) {
    console.log(err);
  }
};

export const rmCar = async (req, res, next) => {
  // Removes a car

  try {
    const carToRemove = req.params.carID;
    const owner = req.session.userId;

    const deleted = await carModel.findOneAndDelete({
      ID: carToRemove,
      owner: owner,
    });

    if (!deleted)
      return res.status(400).json({ error: `That car doesn't exist.` });

    res.status(200).json(`${carToRemove} deleted`);

    console.log(
      `\n@ ${time.toLocaleDateString()} - ${time.toLocaleTimeString()}\n  Car deleted\n    ${
        deleted.name
      }\n    ${deleted.garage.name} - ${deleted.garage.desc} - ${
        deleted.garage.ID
      }\n    ${owner}`
    );
  } catch (err) {
    console.log(err);
  }
};

export const moveCar = async (req, res, next) => {
  // Moves a car

  try {
    const cars = req.body.cars;
    const to = req.body.newGarageID;
    const owner = req.session.userId;

    if (!cars || !to) return res.status(400).send();

    let newGarage = await getGarageById(to, owner);
    if (newGarage.error) return res.status(400).json(newGarage);

    let errors = [];
    let movedCars = [];

    for (const car of cars) {
      const foundCar = await carModel.findOne({ ID: car.ID, owner: owner });

      if (foundCar.owner !== owner) {
        return console.log("rip");
      }

      if (!foundCar) {
        console.log(
          `\n@ ${time.toLocaleDateString()} - ${time.toLocaleTimeString()}\n  MOVE ERROR\n    Car not found\n    requested car: ${
            car.name
          }`
        );
        errors.push("move error");
      }

      if (foundCar.garage.ID === to) {
        console.log(
          `\n@ ${time.toLocaleDateString()} - ${time.toLocaleTimeString()}\n  MOVE ERROR\n    Car already in garage\n    requested car: ${
            car.name
          }\n\n    from: ${car.garage.name} - ${car.garage.desc}\n    to: ${
            newGarage.name
          } - ${newGarage.desc}`
        );
        errors.push("move error 2");
      }

      let newCar = await carModel.findOneAndUpdate(
        { ID: car.ID, owner: owner },
        {
          $set: {
            "garage.ID": to,
            "garage.name": newGarage.name,
            "garage.desc": newGarage.desc,
          },
        },
        { new: true }
      );

      if (!newCar) {
        errors.push("mongoose error ehkä");
        return console.log(`Error updating a car: ${err}`);
      }

      movedCars.push({
        name: foundCar.name,
        from: {
          gName: foundCar.garage.name,
          gDesc: foundCar.garage.desc,
          gID: foundCar.garage.ID,
        },
        to: {
          gName: newCar.garage.name,
          gDesc: newCar.garage.desc,
          gID: newCar.garage.ID,
        },
        owner: foundCar.owner,
      });
    }

    if (errors.length) {
      console.log(
        `\n@ ${time.toLocaleDateString()} - ${time.toLocaleTimeString()}\n    ERRORS: ${errors}`
      );
      return res.status(400).send();
    }

    movedCars.forEach((car) => {
      console.log(
        `\n@ ${time.toLocaleDateString()} - ${time.toLocaleTimeString()}\n  MOVED\n    ${
          car.name
        }\n\n    from: ${car.from.gName} - ${car.from.gDesc} - ${
          car.from.gID
        }\n    to: ${car.to.gName} - ${car.to.gDesc} - ${
          car.to.gID
        }\n    owner: ${car.owner}`
      );
    });

    console.log(`\nMoved ${movedCars.length} cars`);

    res.status(200).json(movedCars);
  } catch (err) {
    console.log(err);
  }
};

export const searchCar = async (req, res, next) => {
  // Gives the car(s) that matches with the query

  try {
    const searchQuery = req.query.q.toLowerCase();
    const owner = req.session.userId;

    if (!searchQuery) return res.status(400).json({ error: `Empty query` });

    let cars = await carModel.find({ owner: owner }, "-_id -__v");

    let toSend = cars.filter(
      (car) =>
        car.name.includes(searchQuery) ||
        car.garage.name.includes(searchQuery) ||
        car.garage.desc.includes(searchQuery) ||
        car.name.startsWith(searchQuery)
    );

    if (!toSend.length) {
      return res.status(204).json({ message: "No cars found" });
    }

    if (toSend.length > 20) {
      toSend = toSend.slice(0, 21);
    }

    return res.status(200).json(toSend);
  } catch (err) {
    console.log(err);
  }
};

export const possibleCars = async (req, res, next) => {
  try {
    let searchQuery = req.query.q.toLowerCase();

    if (!searchQuery) return res.status(400).json({ error: `Empty query` });

    let query = possibleCarModel.find({}, "-_id -__v -iamges -topSpeed -price");

    query = query.regex("name", new RegExp(searchQuery, "i"));

    let results = await query.exec();

    if (!results.length)
      return res.status(204).json({ message: "No cars found" });

    if (results.length > 10) {
      results = results.slice(0, 11);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
  }
};
