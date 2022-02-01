import { InitResetPasswordCard } from "../components/Cards/ResetPassword/InitResetPassword";
import SingleCardPageLayout from "../components/SingleCardPageLayout";
import { useAuthPageRedirector } from "../hooks/useAuthPageRedirector";

const InitResetPasswordPage = () => {
  useAuthPageRedirector();

  return (
    <SingleCardPageLayout>
      <InitResetPasswordCard />
    </SingleCardPageLayout>
  );
};

export default InitResetPasswordPage;
