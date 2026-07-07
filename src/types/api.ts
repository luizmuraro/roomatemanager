export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  householdId: string | null;
  avatarUrl: string | null;
}

export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  inviteCode: string;
  createdAt: string;
}

export type ExpenseCategory =
  | "alimentacao"
  | "moradia"
  | "transporte"
  | "saude"
  | "lazer"
  | "outros";

export interface Expense {
  id: string;
  householdId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string;
  splitRatio: number;
  date: string;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SummaryMember {
  id: string;
  name: string;
  balanceCents: number;
}

export interface SummaryTransfer {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
}

export interface ExpenseSummary {
  householdId: string;
  members: SummaryMember[];
  transfer: SummaryTransfer | null;
}

export interface ShoppingItem {
  id: string;
  householdId: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  householdId: string;
  uploadedBy: string;
  title: string;
  amount: number | null;
  category: ExpenseCategory;
  date: string;
  linkedExpenseId: string | null;
  fileType: "image" | "pdf";
  mimeType: string;
  fileUrl: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

// Divergencias mapeadas para resolver na Etapa 5:
// 1) src/types/expense.ts usa id, paidBy como "me"|"partner", partnerName e status de UI,
//    enquanto a API retorna paidBy como id de usuario e nao inclui partnerName/status.
// 2) src/types/shopping.ts usa id, addedBy como "me"|"partner" e emoji,
//    enquanto a API retorna addedBy como id de usuario, householdId e timestamps.
