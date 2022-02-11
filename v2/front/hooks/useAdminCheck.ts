import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAccessTokenOnlyLocal } from "../util/accessToken";
import { paths } from "../util/constants";
import { checkAdmin } from "../util/jwt";

export const useAdminCheck = () => {
  const token = getAccessTokenOnlyLocal();

  const [viewBlocked, setViewBlocked] = useState(true);
  const [layoutViewBlocked, setLayoutViewBlocked] = useState(token ? false : true);
  const router = useRouter();

  const handleUnauthorized = () => {
    router.push(paths.home());
  };

  useEffect(() => {
    const check = async () => {
      const isAdmin = await checkAdmin();
      if (!isAdmin) return handleUnauthorized();

      setViewBlocked(false);
      setLayoutViewBlocked(false);
    };

    check();
  }, []);

  return { layoutViewBlocked, viewBlocked };
};
