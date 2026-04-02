import type { Expense, ExpenseCategory, ExpenseStatus } from "@/types/expense";

interface ExpenseCategoryStyle {
  badgeClassName: string;
  dotClassName: string;
}

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

export const expenseCategoryStyleMap: Record<ExpenseCategory, ExpenseCategoryStyle> = {
  alimentacao: {
    badgeClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    dotClassName: "bg-blue-500",
  },
  moradia: {
    badgeClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    dotClassName: "bg-green-500",
  },
  transporte: {
    badgeClassName: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    dotClassName: "bg-amber-500",
  },
  saude: {
    badgeClassName: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    dotClassName: "bg-rose-500",
  },
  lazer: {
    badgeClassName: "bg-violet-100 text-violet-700 hover:bg-violet-100",
    dotClassName: "bg-violet-500",
  },
  outros: {
    badgeClassName: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    dotClassName: "bg-slate-500",
  },
};

export const expenseStatusOptions: Array<{ value: ExpenseStatus; label: string }> = [
  { value: "pendente", label: "Pendente" },
  { value: "parcial", label: "Parcial" },
  { value: "quitado", label: "Quitado" },
];

export const getMyShare = (expense: Expense) => Math.round(expense.amount * expense.splitRatio);
