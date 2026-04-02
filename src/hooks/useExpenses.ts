import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Expense, ExpenseSummary } from "@/types/api";

type ExpenseFilters = {
  category?: string;
  month?: number;
  year?: number;
  paidBy?: string;
};

type CreateExpenseInput = {
  description: string;
  amount: number;
  category: Expense["category"];
  paidBy: string;
  splitRatio: number;
  date: string;
  receiptUrl?: string;
};

type UpdateExpenseInput = {
  id: string;
} & Partial<CreateExpenseInput>;

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};

      if (filters?.category !== undefined) {
        params.category = filters.category;
      }

      if (filters?.month !== undefined) {
        params.month = filters.month;
      }

      if (filters?.year !== undefined) {
        params.year = filters.year;
      }

      if (filters?.paidBy !== undefined) {
        params.paidBy = filters.paidBy;
      }

      const response = await apiClient.get<ApiResponse<Expense[]>>("/api/expenses", {
        params,
      });

      return response.data;
    },
  });
}

export function useExpenseSummary() {
  return useQuery({
    queryKey: ["expenses", "summary"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ExpenseSummary>>("/api/expenses/summary");
      return response.data;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateExpenseInput) => {
      const response = await apiClient.post<ApiResponse<Expense>>("/api/expenses", payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      await queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
      toast.success("Despesa adicionada");
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateExpenseInput) => {
      const response = await apiClient.patch<ApiResponse<Expense>>(`/api/expenses/${id}`, payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      await queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<{ deleted: true }>>(`/api/expenses/${id}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      await queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
      toast.success("Despesa removida");
    },
  });
}
