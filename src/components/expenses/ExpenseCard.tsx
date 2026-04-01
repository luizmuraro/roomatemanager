import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { expenseCategoryLabelMap, expenseStatusLabelMap, getMyShare } from "@/lib/expense";
import { formatCurrencyBRLFromCents, formatDateBR } from "@/lib/formatters";
import type { Expense, ExpenseStatus } from "@/types/expense";
import { CalendarDays, Eye, MoreVertical, Receipt, UserRound } from "lucide-react";

interface ExpenseCardProps {
  expense: Expense;
}

const statusClassMap: Record<ExpenseStatus, string> = {
  pendente: "bg-orange-100 text-orange-800",
  parcial: "bg-yellow-100 text-yellow-800",
  quitado: "bg-green-100 text-green-800",
};

const rowAccentMap: Record<ExpenseStatus, string> = {
  pendente: "border-l-orange-400",
  parcial: "border-l-yellow-400",
  quitado: "border-l-green-400",
};

export const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const myShare = getMyShare(expense);
  const sharePercent = Math.round(expense.splitRatio * 100);
  const isCredit = expense.paidBy === "me";

  return (
    <div className={`border-l-4 ${rowAccentMap[expense.status]} px-4 py-3 transition-colors hover:bg-gray-50`}>
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{expense.description}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{formatDateBR(expense.date)}</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900">{formatCurrencyBRLFromCents(expense.amount)}</p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{expenseCategoryLabelMap[expense.category]}</Badge>
          <Badge className={statusClassMap[expense.status]}>{expenseStatusLabelMap[expense.status]}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <UserRound className="h-3.5 w-3.5" />
            {expense.paidBy === "me" ? "Você" : expense.roommateName}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className={`text-xs font-semibold ${isCredit ? "text-green-600" : "text-red-600"}`}>
            {isCredit ? "+" : ""}
            {formatCurrencyBRLFromCents(myShare)} ({sharePercent}%)
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Receipt className="h-3.5 w-3.5" />
            {expense.receiptUrl ? "Com comprovante" : "Sem comprovante"}
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-4 md:grid md:grid-cols-12">
        <div className="col-span-4 min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{expense.description}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDateBR(expense.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" />
              {expense.paidBy === "me" ? "Você" : expense.roommateName}
            </span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{expenseCategoryLabelMap[expense.category]}</Badge>
          </div>
        </div>

        <div className="col-span-2 text-center text-sm font-semibold text-gray-900">{formatCurrencyBRLFromCents(expense.amount)}</div>

        <div className="col-span-2 text-center">
          <p className={`text-sm font-semibold ${isCredit ? "text-green-600" : "text-red-600"}`}>
            {isCredit ? "+" : ""}
            {formatCurrencyBRLFromCents(myShare)}
          </p>
          <p className="text-[11px] text-gray-500">{sharePercent}%</p>
        </div>

        <div className="col-span-2 flex flex-col items-center justify-center gap-1 text-center">
          <Badge className={statusClassMap[expense.status]}>{expenseStatusLabelMap[expense.status]}</Badge>
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] text-gray-500">
            <Receipt className="h-3.5 w-3.5" />
            {expense.receiptUrl ? "Comprovante" : "Sem comprov."}
          </span>
        </div>

        <div className="col-span-2 flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:text-blue-700">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:text-gray-700">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
