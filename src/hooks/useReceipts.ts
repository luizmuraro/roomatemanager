import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, ExpenseCategory, Receipt } from "@/types/api";

type ReceiptFilters = {
  category?: ExpenseCategory;
  linkedExpenseId?: string;
};

type UploadReceiptInput = {
  file: File;
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  date?: string;
  linkedExpenseId?: string;
};

export function useReceipts(filters?: ReceiptFilters) {
  return useQuery({
    queryKey: ["receipts", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (filters?.category !== undefined) {
        params.category = filters.category;
      }

      if (filters?.linkedExpenseId !== undefined) {
        params.linkedExpenseId = filters.linkedExpenseId;
      }

      const response = await apiClient.get<ApiResponse<Receipt[]>>("/api/receipts", {
        params,
      });

      return response.data;
    },
  });
}

export function useUploadReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UploadReceiptInput) => {
      const formData = new FormData();
      formData.append("file", payload.file);

      if (payload.title !== undefined) formData.append("title", payload.title);
      if (payload.amount !== undefined) formData.append("amount", String(payload.amount));
      if (payload.category !== undefined) formData.append("category", payload.category);
      if (payload.date !== undefined) formData.append("date", payload.date);
      if (payload.linkedExpenseId !== undefined) formData.append("linkedExpenseId", payload.linkedExpenseId);

      const response = await apiClient.post<ApiResponse<Receipt>>("/api/receipts", formData);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Comprovante enviado");
    },
  });
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<{ deleted: true }>>(`/api/receipts/${id}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Comprovante removido");
    },
  });
}
