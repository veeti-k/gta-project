import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { IGarage } from "../../../interfaces/Garage";
import { actions } from "../../../state/actions";
import { useISelector } from "../../../state/hooks";
import { StyledButton } from "../../Cards/Signin/Buttons/Styles";
import { Move_GarageInput } from "../../Input/react-select/Move-GarageInput";
import { Desc } from "../../Styles/Text";

export const Move = ({ open }) => {
  const dispatch = useDispatch();
  const checkedCars = useISelector((state) => state.checked.cars);
  const chosenGarage = useISelector((state) => state.move.chosenGarage);
  const searchInput = useISelector((state) => state.search.input.value);
  const mobile = useISelector((state) => state.checked.show);

  const plural = checkedCars.length === 1 ? "" : "s";

  const onSelect = (value: IGarage) => {
    dispatch(actions.move.set.chosenGarage(value));
  };

  const onMoveClick = () => {
    if (!chosenGarage) return toast.error("No chosen garage");
    if (!checkedCars.length) return toast.error("No selected cars");
    dispatch(actions.move.move(checkedCars, chosenGarage, searchInput));
    dispatch(actions.move.show(false));
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
        >
          {!mobile && <br />}
          <Desc>Select a garage below to move the selected car{plural} there.</Desc>
          <br />
          <br />
          <Move_GarageInput onSelect={onSelect} />

          <StyledButton
            blue
            style={{ marginTop: "0.5rem" }}
            onClick={onMoveClick}
            disabled={!!!chosenGarage || !checkedCars.length}
          >
            Move
          </StyledButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};