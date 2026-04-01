import { useMemo, useState } from "react";
import type { ReceiptItem } from "@/types/receipt";

export type ReceiptFilter = "all" | "recent" | "mercado" | "moradia" | "unlinked";
export type SortMode = "date" | "amount" | "category";

export const useReceiptFilters = (receipts: ReceiptItem[]) => {
  const [activeFilter, setActiveFilter] = useState<ReceiptFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");

  const filteredReceipts = useMemo(() => {
    let next = [...receipts];

    if (activeFilter === "recent") {
      next = next.filter((item) => {
        const diffInDays = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
      });
    }

    if (activeFilter === "mercado") {
      next = next.filter((item) => item.category === "mercado");
    }

    if (activeFilter === "moradia") {
      next = next.filter((item) => item.category === "moradia");
    }

    if (activeFilter === "unlinked") {
      next = next.filter((item) => !item.linkedExpenseId);
    }

    next.sort((a, b) => {
      if (sortMode === "amount") return b.amount - a.amount;
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
