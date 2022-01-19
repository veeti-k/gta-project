import axios from "axios";
import { useState } from "react";
import { Input } from "../../Input/Input";
import { InputContainer, Label } from "../../Styles/Page-cards";
import { SigninButton } from "./Buttons/SigninButton";
import { config } from "../../../util/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { TestButton } from "./Buttons/TestButton";
import { RegisterButton } from "./Buttons/RegisterButton";
import { ButtonContainer } from "../../Styles/SinglePage";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SignInForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signInButtonDisabled = !username || !password;

  const onSignInClick = async () => {
    if (signInButtonDisabled) return;
    try {
      const res = await axios(
        config("/auth/login", "POST", {
          username,
          password,
        })
      );

      if (res?.status === 204) router.push("/", "/", { shallow: true });
    } catch (err) {
      if (!err.response) return;
      if (err.response.status === 401) toast.error("Incorrect credentials");
      if (err.response.status === 404) toast.error("User not found");
    }
  };

  return (
    <>
      <InputContainer column>
        <Label column htmlFor="username">
          Username
        </Label>
        <UsernameInput value={username} onChange={setUsername} />
      </InputContainer>

      <InputContainer column>
        <Label column htmlFor="password">
          Password
        </Label>
        <PassInput value={password} onChange={setPassword} />
      </InputContainer>

      <ButtonContainer>
        <SigninButton onClick={onSignInClick} disabled={signInButtonDisabled} />

        <ButtonContainer row>
          <TestButton />
          <RegisterButton />
        </ButtonContainer>
      </ButtonContainer>
    </>
  );
};

const UsernameInput = ({ value, onChange }: InputProps) => {
  return <Input transparent id="username" type="text" onChange={onChange} value={value} />;
};

const PassInput = ({ value, onChange }: InputProps) => {
  return <Input transparent id="password" type="password" onChange={onChange} value={value} />;
};
