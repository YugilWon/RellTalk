import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/app/lib/queries/user";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  });
};
