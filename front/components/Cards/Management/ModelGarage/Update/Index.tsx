import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdminCheck } from "../../../../../hooks/useAdminCheck";
import { request } from "../../../../../util/axios";
import { paths } from "../../../../../util/constants";
import { PageButton } from "../../../../Common/Buttons";
import { PageCard } from "../../../../Common/Cards";
import { InputContainer, PageButtonContainer } from "../../../../Common/Containers";
import { Title } from "../../../../Common/Text";
import { getGarage } from "./getGarage";
import { CapacityInput, NameInput } from "./Inputs";

export const ModelGarageUpdateCard = () => {
  const router = useRouter();

  const garageId = router.query.garageId as string | undefined;

  const [originalName, setOriginalName] = useState("");
  const [originalCapacity, setOriginalCapacity] = useState("");

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    getGarage({ setName, setOriginalName, setCapacity, setOriginalCapacity, garageId });
  }, []);

  const onSave = async () => {
    const res = await request(`/modelgarages/${garageId}`, "PATCH", { name, capacity });

    if (res) {
      toast.success("Model garage updated successfully!");
      getGarage({ setName, setOriginalName, setCapacity, setOriginalCapacity, garageId });
    }
  };

  const onBackClick = () => {
    router.push(paths.mgmtModelGarageIndex());
  };

  const updateButtonDisabled =
    !name || !capacity || (name === originalName && capacity === originalCapacity);

  return (
    <PageCard centered>
      <Title style={{ paddingBottom: "1rem" }}>Update model garage</Title>

      <InputContainer>
        <NameInput value={name} setValue={setName} />
        <CapacityInput value={capacity} setValue={setCapacity} />
      </InputContainer>

      <PageButtonContainer>
        <PageButton gray onClick={onBackClick}>
          Back
        </PageButton>
        <PageButton green onClick={onSave} disabled={updateButtonDisabled}>
          Update
        </PageButton>
      </PageButtonContainer>
    </PageCard>
  );
};
