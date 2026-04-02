import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, User } from "@/types/api";

type UpdateMeInput = {
  name?: string;
  avatarUrl?: string;
};

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User>>("/api/users/me");
      return response.data;
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateMeInput) => {
      const response = await apiClient.patch<ApiResponse<User>>("/api/users/me", payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Perfil atualizado");
    },
  });
}
