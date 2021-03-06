import { ModelGarageUpdateCard } from "../../../components/Cards/Management/ModelGarage/Update/Index";
import Layout from "../../../components/Layouts/Layout";
import { useAdminCheck } from "../../../hooks/useAdminCheck";

const ModelGaragePage = () => {
  const { layoutViewBlocked, viewBlocked } = useAdminCheck();

  if (layoutViewBlocked) return null;

  return <Layout title={"Update model garage"}>{!viewBlocked && <ModelGarageUpdateCard />}</Layout>;
};

export default ModelGaragePage;
