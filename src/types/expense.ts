export type ExpenseCategory =
  | "alimentacao"
  | "moradia"
  | "transporte"
  | "saude"
  | "lazer"
  | "outros";

export type ExpenseStatus = "pendente" | "parcial" | "quitado";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: "me" | "partner";
  splitRatio: number;
  date: string;
  partnerName: string;
  status: ExpenseStatus;
  receiptUrl?: string;
}

export interface ExpenseDraft {
  description: string;
  amount: string;
  category: ExpenseCategory;
  paidBy: "me" | "partner";
  date: string;
  splitType: "equal" | "custom";
  splitRatio: number;
}
