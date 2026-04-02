import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, ShoppingItem } from "@/types/api";

type CreateShoppingItemInput = {
  name: string;
  quantity?: number;
  unit?: string;
};

type UpdateShoppingItemInput = {
  id: string;
  name?: string;
  quantity?: number;
  unit?: string;
  checked?: boolean;
};

export function useShoppingItems() {
  return useQuery({
    queryKey: ["shopping"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ShoppingItem[]>>("/api/shopping");
      return response.data;
    },
  });
}

export function useCreateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateShoppingItemInput) => {
      const response = await apiClient.post<ApiResponse<ShoppingItem>>("/api/shopping", payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shopping"] });
    },
  });
}

export function useUpdateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateShoppingItemInput) => {
      const response = await apiClient.patch<ApiResponse<ShoppingItem>>(`/api/shopping/${id}`, payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shopping"] });
    },
  });
}

export function useDeleteShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<{ deleted: true }>>(`/api/shopping/${id}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shopping"] });
    },
  });
}

export function useDeleteCheckedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
        "/api/shopping/checked",
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shopping"] });
      toast.success("Itens marcados removidos");
    },
  });
}
