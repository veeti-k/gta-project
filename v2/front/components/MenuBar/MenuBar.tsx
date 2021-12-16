import { styled } from "../../stitches.config";
import { SearchBar } from "./SearchBar";
import NewCarButton from "./Buttons/NewCar";
import NewGarageButton from "./Buttons/NewGarage";
import { ProfileButton } from "./Buttons/ProfileButton";

const MenubarContainer = styled("nav", {
  height: "5rem",
  position: "sticky",
  top: "0px",
  backgroundColor: "#212121",
  display: "flex",
  zIndex: "1",
});

const MenubarContent = styled("div", {
  display: "flex",
  margin: "0 auto",
  maxWidth: "1800px",
  width: "100%",
});

const LeftContainer = styled("div", {
  width: "calc(100% - 430px)",
  display: "flex",
});

const RightContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  padding: "1rem 1rem 1rem 0.5rem",
  maxWidth: "430px",
  width: "100%",
});

const LeftButtons = styled("div", {
  display: "flex",
  gap: "1rem",
});

export const MenuBar = () => {
  return (
    <MenubarContainer>
      <MenubarContent>
        <LeftContainer>
          <SearchBar />
        </LeftContainer>

        <RightContainer>
          <LeftButtons>
            <NewCarButton />
            <NewGarageButton />
          </LeftButtons>
          <ProfileButton />
        </RightContainer>
      </MenubarContent>
    </MenubarContainer>
  );
};
