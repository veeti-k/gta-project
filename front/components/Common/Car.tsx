import { ICar, ModelCar } from "../../interfaces/Car";
import { useISelector } from "../../state/hooks";
import { Card } from "./Cards";
import { Text, Title } from "./Text";
import { SpaceBetween } from "./Containers";
import { ReactElement } from "react";
import { motion } from "framer-motion";
interface CarPropsBase<T> {
  car: T;
}

interface CarProps<T> extends CarPropsBase<T> {
  onClick?: (car: T) => any;
}

export function Car(props: CarProps<ICar>): ReactElement;
export function Car(props: CarProps<ModelCar>): ReactElement;

export function Car({ car, onClick }) {
  const checkedCars = useISelector((state) => state.checked.cars);
  const thisChecked = checkedCars.some((checkedCar: ICar) => checkedCar.id === car.id);

  const onCarClick = (e, car) => {
    e.stopPropagation();
    if (onClick) onClick(car);
  };

  return (
    <motion.div>
      <Card red={!!car.reason} checked={thisChecked} onClick={(e) => onCarClick(e, car)}>
        <SpaceBetween>
          <Text>{car.manufacturer}</Text>
          {!!car.garage && <Text>{car.garage.name}</Text>}
        </SpaceBetween>

        <Title>{car.name}</Title>
        <Text>{car.class}</Text>

        {!!car.reason && (
          <Text style={{ paddingTop: "1rem" }}>
            <b>Error:</b> {car.reason}
          </Text>
        )}
      </Card>
    </motion.div>
  );
}
