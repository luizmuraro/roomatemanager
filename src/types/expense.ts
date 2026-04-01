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
  paidBy: "me" | "roommate";
  splitRatio: number;
  date: string;
  roommateName: string;
  status: ExpenseStatus;
  receiptUrl?: string;
}

export interface ExpenseDraft {
  description: string;
  amount: string;
  category: ExpenseCategory;
  paidBy: "me" | "roommate";
  date: string;
  splitType: "equal" | "custom";
  splitRatio: number;
}
