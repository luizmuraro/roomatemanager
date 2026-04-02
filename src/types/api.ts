export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  householdId: string | null;
  avatarUrl?: string;
}

export interface Household {
  _id: string;
  name: string;
  members: User[];
  inviteCode: string;
}

export type ExpenseCategory =
  | "alimentacao"
  | "moradia"
  | "transporte"
  | "saude"
  | "lazer"
  | "outros";

export interface Expense {
  _id: string;
  householdId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: User;
  splitRatio: number;
  date: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface ShoppingItem {
  _id: string;
  householdId: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  addedBy: User;
  createdAt: string;
}

export interface ExpenseSummary {
  balance: number;
  myTotal: number;
  partnerTotal: number;
}

// Divergencias mapeadas para resolver na Etapa 5:
// 1) src/types/expense.ts usa id, paidBy como "me"|"partner", partnerName e status de UI,
//    enquanto a API retorna _id, paidBy como objeto User e nao inclui partnerName/status.
// 2) src/types/shopping.ts usa id, addedBy como "me"|"partner" e emoji,
//    enquanto a API retorna _id, addedBy como objeto User, householdId e createdAt.
// 3) src/types/receipt.ts define recibos de UI, mas nao ha contrato de receipt no backend atual.
// 4) src/types/settings.ts define estado de configuracoes de UI, sem endpoint equivalente mapeado aqui.
