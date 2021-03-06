import { useState } from "react";
import { request } from "../../../../../util/axios";
import { Input } from "../../../../Common/Input/Input";
import { Label } from "../../../../Common/Text";

export const SearchInput = ({ setMatching }) => {
  const [value, setValue] = useState("");

  const onChange = async (value: string) => {
    setValue(value);

    if (!value.length) return setMatching([]);

    const res = await request(`/modelgarages?query=${value}`, "GET");

    if (res) {
      setMatching(res.data);
    }
  };

  return (
    <>
      <Label htmlFor="search-model-garages">Search</Label>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        id="search-model-garages"
        placeholder="E.g. Popular street, unit 2"
      />
    </>
  );
};
