import { styled } from "@stitches/react";
import { BaseBtn } from "../../Styles/Buttons";
import { Desc, Title } from "../../Styles/Text";
import { SigninButton } from "./Buttons/SigninButton";
import { TestButton } from "./Buttons/TestButton";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "$background",
});

const StyledCard = styled("div", {
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 20%)",
  padding: "1rem",
  margin: "1rem",
  marginBottom: "10rem",
  backgroundColor: "White",
});

const ButtonContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const SignInCard = () => {
  return (
    <Wrapper>
      <StyledCard>
        <Title>Sign in</Title>
        <Desc>Sign in with your socials or get a temporary test account.</Desc>
        <ButtonContainer>
          <SigninButton />
          <TestButton />
        </ButtonContainer>
      </StyledCard>
    </Wrapper>
  );
};
