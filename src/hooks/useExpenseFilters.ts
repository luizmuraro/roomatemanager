import { useMemo, useState } from "react";
import { getMyShare } from "@/lib/expense";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/types/expense";

export type QuickFilter = "all" | "me-paid" | "roommate-paid" | "high-value" | "pending";

export const quickFilterLabels: Record<QuickFilter, string> = {
  all: "Todos",
  "me-paid": "Você pagou",
  "roommate-paid": "Parceiro pagou",
  "high-value": "Acima de R$ 100",
  pending: "Em aberto",
};

export const useExpenseFilters = (expenses: Expense[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | "all">("all");
  const [status, setStatus] = useState<ExpenseStatus | "all">("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchMatch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.roommateName.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = category === "all" || expense.category === category;
      const statusMatch = status === "all" || expense.status === status;

      const quickMatch = (() => {
        if (quickFilter === "all") return true;
        if (quickFilter === "me-paid") return expense.paidBy === "me";
        if (quickFilter === "roommate-paid") return expense.paidBy === "roommate";
        if (quickFilter === "high-value") return expense.amount > 10000;
        return expense.status !== "quitado";
      })();

      return searchMatch && categoryMatch && statusMatch && quickMatch;
    });
  }, [expenses, searchTerm, category, status, quickFilter]);

  const summary = useMemo(() => {
    const totalAmount = filteredExpenses.reduce((acc, item) => acc + item.amount, 0);
    const youOwe = filteredExpenses
      .filter((item) => item.paidBy === "roommate" && item.status !== "quitado")
      .reduce((acc, item) => acc + getMyShare(item), 0);
    const pendingCount = filteredExpenses.filter((item) => item.status !== "quitado").length;

    return { totalAmount, youOwe, pendingCount };
  }, [filteredExpenses]);

  return {
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    status,
    setStatus,
    quickFilter,
    setQuickFilter,
    filteredExpenses,
    summary,
  };
};
