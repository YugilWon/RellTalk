import { supabase } from "@/utils/supabase/client";

export const fetchUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
};
