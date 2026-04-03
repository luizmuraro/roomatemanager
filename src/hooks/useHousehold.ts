import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Household } from "@/types/api";

type HouseholdRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

type CreateHouseholdInput = {
  name: string;
};

type JoinHouseholdInput = {
  inviteCode: string;
};

export function useHousehold() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["household"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Household>>("/api/household");
      return response.data;
    },
    enabled: Boolean(user?.householdId),
  });
}

export function useCreateHousehold() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (payload: CreateHouseholdInput) => {
      const response = await apiClient.post<ApiResponse<Household>>("/api/household", payload, {
        skipAuthRedirect: true,
      } as HouseholdRequestConfig);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await refreshUser();
    },
  });
}

export function useJoinHousehold() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (payload: JoinHouseholdInput) => {
      const response = await apiClient.post<ApiResponse<Household>>("/api/household/join", payload, {
        skipAuthRedirect: true,
      } as HouseholdRequestConfig);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await refreshUser();
    },
  });
}

export function useGenerateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<{ inviteCode: string }>>(
        "/api/household/invite",
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["household"] });
    },
  });
}
