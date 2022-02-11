import { useState } from "react";
import { Input } from "../../Input/Input";
import { SigninButton } from "./Buttons/SigninButton";
import { useRouter } from "next/router";
import { TestButton } from "./Buttons/TestButton";
import { RegisterButton } from "./Buttons/RegisterButton";
import { request } from "../../../util/axios";
import { Label, Text } from "../../Styles/Text";
import { FormWrapper } from "../../Styles/Forms";
import { ButtonContainer, InputContainer } from "../../Styles/Containers";
import { paths } from "../../../util/constants";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SignInForm = () => {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInButtonDisabled = !usernameOrEmail || !password;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (signInButtonDisabled) return;

    const res = await request("/auth/login", "POST", {
      usernameOrEmail,
      password,
    });

    if (res) router.push(paths.home());
  };

  return (
    <form onSubmit={onSubmit}>
      <FormWrapper>
        <InputContainer column>
          <Label column htmlFor="username-or-email">
            Username or email
          </Label>
          <UsernameOrEmailInput value={usernameOrEmail} onChange={setUsernameOrEmail} />

          <Label column htmlFor="password">
            Password
          </Label>
          <PassInput value={password} onChange={setPassword} />
        </InputContainer>

        <Text>
          <a href={paths.initPasswordReset()}>Forgot password?</a>
        </Text>

        <ButtonContainer>
          <SigninButton onClick={() => {}} disabled={signInButtonDisabled} />

          <ButtonContainer row>
            <TestButton />
            <RegisterButton />
          </ButtonContainer>
        </ButtonContainer>
      </FormWrapper>
    </form>
  );
};

const UsernameOrEmailInput = ({ value, onChange }: InputProps) => {
  return <Input required id="username-or-email" type="text" onChange={onChange} value={value} />;
};

const PassInput = ({ value, onChange }: InputProps) => {
  return <Input required id="password" type="password" onChange={onChange} value={value} />;
};
