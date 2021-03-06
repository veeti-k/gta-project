import { useState } from "react";
import { useDispatch } from "react-redux";
import { OptionProps, components, GroupBase } from "react-select";
import AsyncSelect from "react-select/async";
import { IGarage } from "../../../../../interfaces/Garage";
import { actions } from "../../../../../state/actions";
import { useISelector } from "../../../../../state/hooks";
import { request } from "../../../../../util/axios";
import { Text } from "../../../Text";
import { theme, NoOptionsMessage, styles } from "../shared";

const Option = (props: OptionProps<IGarage, false, GroupBase<IGarage>>) => (
  <components.Option {...props}>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {" "}
      <Text>
        {props.data.cars.length} / {props.data.capacity}
      </Text>
      <Text>
        {props.label} {props.isDisabled && <Text>- (Not enough room)</Text>}
      </Text>
      <Text>{!!props.data.desc && props.data.desc}</Text>
    </div>
  </components.Option>
);

export const GarageInputSelect = () => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const state = useISelector((state) => state.newCar);
  const inputValue = state.inputs.garage;

  const dispatch = useDispatch();

  const loadOptions = (inputValue: string, callback: (options: IGarage[]) => void) => {
    if (timer) clearTimeout(timer);

    const timeout = setTimeout(async () => {
      const res = await request(`/garages?query=${inputValue}`, "GET");

      if (res) callback(res.data);
    }, 200);

    setTimer(timeout);
  };

  const onChange = (garage: IGarage, _) => dispatch(actions.newCar.setInput.garage(garage));

  return (
    <AsyncSelect
      isSearchable
      isClearable
      isOptionDisabled={(option: IGarage) => option.room < state.inputs.cars.length}
      value={inputValue}
      components={{ Option, NoOptionsMessage }}
      loadOptions={loadOptions}
      onChange={onChange}
      getOptionLabel={(option: IGarage) => option.name}
      getOptionValue={(option: IGarage) => option.id}
      placeholder="Select a garage..."
      theme={theme}
      styles={styles}
    />
  );
};
