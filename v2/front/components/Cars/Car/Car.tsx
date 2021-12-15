import { useDispatch } from "react-redux";
import { actions } from "../../../state/actions";
import { useISelector } from "../../../state/hooks";
import { CarCard } from "../../Defaults/Cards";
import { Text, Title } from "../../Defaults/Text";

const Car = ({ car }) => {
  const dispatch = useDispatch();

  const checkedCars = useISelector((state) => state.checked.cars);

  const handleClick = () => {
    dispatch(actions.check.car(car.id));
  };

  const checked = checkedCars.includes(car.id);

  return (
    <CarCard checked={checked} onClick={() => handleClick()}>
      <Text>{car.class}</Text>
      <Title>{car.name}</Title>
      <Text>{car.garage.name}</Text>
    </CarCard>
  );
};

export default Car;
