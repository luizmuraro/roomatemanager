import { useMemo, useState } from "react";
import type { ExpenseCategory } from "@/types/api";
import type { Receipt } from "@/types/receipt";

export type ReceiptFilter = "all" | "recent" | ExpenseCategory | "unlinked";
export type SortMode = "date" | "amount" | "category";

export const useReceiptFilters = (receipts: Receipt[]) => {
  const [activeFilter, setActiveFilter] = useState<ReceiptFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");

  const filteredReceipts = useMemo(() => {
    let next = [...receipts];

    if (activeFilter === "recent") {
      next = next.filter((item) => {
        const diffInDays = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
      });
    } else if (activeFilter === "unlinked") {
      next = next.filter((item) => !item.linkedExpenseId);
    } else if (activeFilter !== "all") {
      next = next.filter((item) => item.category === activeFilter);
    }

    next.sort((a, b) => {
      if (sortMode === "amount") return (b.amount ?? 0) - (a.amount ?? 0);
      if (sortMode === "category") return a.category.localeCompare(b.category);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return next;
  }, [receipts, activeFilter, sortMode]);

  const unlinkedCount = useMemo(() => receipts.filter((item) => !item.linkedExpenseId).length, [receipts]);

  return {
    activeFilter,
    setActiveFilter,
    sortMode,
    setSortMode,
    filteredReceipts,
    unlinkedCount,
  };
};
