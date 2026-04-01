import { useState } from "react";
import { SettleUpModal } from "@/components/expenses/SettleUpModal";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { getMyShare } from "@/lib/expense";
import { mockExpenses } from "@/lib/mock-data";
import type { Expense } from "@/types/expense";

export const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);

  const outstandingCents = expenses
    .filter((expense) => expense.paidBy === "roommate" && expense.status !== "quitado")
    .reduce((acc, expense) => acc + getMyShare(expense), 0);

  const outstandingBalance = outstandingCents / 100;

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleConfirmSettleUp = (amountPaid: number) => {
    let remainingCents = Math.round(amountPaid * 100);

    setExpenses((prev) =>
      prev.map((expense) => {
        if (remainingCents <= 0 || expense.paidBy !== "roommate" || expense.status === "quitado") {
          return expense;
        }

        const shareCents = getMyShare(expense);

        if (remainingCents >= shareCents) {
          remainingCents -= shareCents;
          return { ...expense, status: "quitado" };
        }

        remainingCents = 0;
        return { ...expense, status: "parcial" };
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <ExpenseList
        expenses={expenses}
        onAddExpenseClick={() => setIsAddModalOpen(true)}
        onSettleUpClick={() => setIsSettleUpOpen(true)}
      />
      <AddExpenseModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddExpense={handleAddExpense}
        roommateName="Alex Silva"
      />
      <SettleUpModal
        open={isSettleUpOpen}
        onOpenChange={setIsSettleUpOpen}
        currentBalance={-outstandingBalance}
        roommateName="Alex Silva"
        onConfirmPayment={handleConfirmSettleUp}
      />
    </div>
  );
};

export default Expenses;
