import { IGarage, ModelGarage } from "../../../interfaces/Garage";
import { styled } from "../../../stitches.config";
import { isModelGarage } from "../../../util/typeguards";
import { Card } from "../../Styles/Cards";
import { Text } from "../../Styles/Text";

interface GarageProps {
  garage: IGarage | ModelGarage;
  onClick: any;
  wide?: boolean;
}

const GarageCard = styled(Card, {
  flexDirection: "row",
  justifyContent: "space-between",

  variants: {
    notAllowed: {
      true: {
        color: "rgba(0,0,0,0.3)",
        cursor: "not-allowed",
      },
    },
  },
});

export const Garage = ({ garage, onClick, wide }: GarageProps) => {
  const isGarage = !isModelGarage(garage);
  const notAllowed = (!isGarage && garage.alreadyOwned) || (isGarage && garage.full);

  const onGarageClick = () => {
    if (notAllowed) return;
    onClick(garage);
  };

  return (
    <GarageCard wide={wide} notAllowed={notAllowed} onClick={() => onGarageClick()}>
      <Text>{garage.name}</Text>

      {isGarage && (
        <Text>
          {garage.amountOfCars} / {garage.capacity}
        </Text>
      )}

      {!isGarage && garage.alreadyOwned && <Text>Already owned</Text>}
    </GarageCard>
  );
};
