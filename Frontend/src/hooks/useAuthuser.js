import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const location = useLocation();
  const isAdminRoute = location?.pathname?.startsWith("/admin");

  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    enabled: !isAdminRoute,
  });

  return {
    isLoading: isAdminRoute ? false : authUser.isLoading,
    authUser: isAdminRoute ? null : authUser.data?.user,
  };
};

export default useAuthUser;
