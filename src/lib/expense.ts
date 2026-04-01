import type { Expense, ExpenseCategory, ExpenseStatus } from "@/types/expense";

export const expenseCategoryLabelMap: Record<ExpenseCategory, string> = {
  alimentacao: "Alimentação",
  moradia: "Moradia",
  transporte: "Transporte",
  saude: "Saúde",
  lazer: "Lazer",
  outros: "Outros",
};

export const expenseStatusLabelMap: Record<ExpenseStatus, string> = {
  pendente: "Pendente",
  parcial: "Parcial",
  quitado: "Quitado",
};

export const expenseCategoryOptions: Array<{ value: ExpenseCategory; label: string }> = [
  { value: "alimentacao", label: "Alimentação" },
  { value: "moradia", label: "Moradia" },
  { value: "transporte", label: "Transporte" },
  { value: "saude", label: "Saúde" },
  { value: "lazer", label: "Lazer" },
  { value: "outros", label: "Outros" },
];

export const expenseStatusOptions: Array<{ value: ExpenseStatus; label: string }> = [
  { value: "pendente", label: "Pendente" },
  { value: "parcial", label: "Parcial" },
  { value: "quitado", label: "Quitado" },
];

export const getMyShare = (expense: Expense) => Math.round(expense.amount * expense.splitRatio);
