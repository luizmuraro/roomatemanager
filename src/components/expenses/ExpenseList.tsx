import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useExpenseFilters, quickFilterLabels, type QuickFilter } from "@/hooks/useExpenseFilters";
import { expenseCategoryLabelMap, expenseCategoryOptions, expenseCategoryStyleMap, expenseStatusOptions } from "@/lib/expense";
import { formatCurrencyBRLFromCents } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/types/expense";
import { ListFilter, Plus, Search, WalletCards, Clock3, ArrowDown, Receipt, HandCoins } from "lucide-react";
import { ExpenseCard } from "./ExpenseCard";

interface ExpenseListProps {
  expenses: Expense[];
  onAddExpenseClick: () => void;
  onSettleUpClick: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export const ExpenseList = ({
  expenses,
  onAddExpenseClick,
  onSettleUpClick,
  onEditExpense,
  onDeleteExpense,
}: ExpenseListProps) => {
  const {
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
  } = useExpenseFilters(expenses);

  return (
    <div className="space-y-3 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Todas as despesas</h1>
          <p className="text-sm text-gray-600">Acompanhe e gerencie as despesas compartilhadas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-lg" onClick={onSettleUpClick}>
            <HandCoins className="h-4 w-4" />
            Acertar contas
          </Button>
          <Button className="hidden md:inline-flex rounded-lg bg-blue-600 hover:bg-blue-700" onClick={onAddExpenseClick}>
            <Plus className="h-4 w-4" />
            Adicionar despesa
          </Button>
        </div>
      </div>

      <Card className="rounded-xl border-gray-200 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
                placeholder="Buscar despesas..."
              />
            </div>

            <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {expenseCategoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(value) => setStatus(value as ExpenseStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {expenseStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-3">
            {Object.keys(quickFilterLabels).map((filter) => {
              const key = filter as QuickFilter;
              const active = quickFilter === key;

              return (
                <Button
                  key={key}
                  variant={active ? "default" : "outline"}
                  className={active ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => setQuickFilter(key)}
                >
                  <ListFilter className="h-4 w-4" />
                  {quickFilterLabels[key]}
                </Button>
              );
            })}
          </div>

          <div className="border-t pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Categorias</p>
            <div className="flex flex-wrap gap-2">
              {expenseCategoryOptions.map((option) => (
                <Badge key={option.value} className={expenseCategoryStyleMap[option.value].badgeClassName}>
                  {expenseCategoryLabelMap[option.value]}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600">Total de despesas</p>
            <p className="mt-0.5 inline-flex items-center gap-2 text-lg font-bold text-gray-900">
              <Receipt className="h-4 w-4 text-blue-600" />
              {formatCurrencyBRLFromCents(summary.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600">Você deve</p>
            <p className="mt-0.5 inline-flex items-center gap-2 text-lg font-bold text-red-600">
              <ArrowDown className="h-4 w-4" />
              {formatCurrencyBRLFromCents(summary.youOwe)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600">Em aberto</p>
            <p className="mt-0.5 inline-flex items-center gap-2 text-lg font-bold text-orange-600">
              <Clock3 className="h-4 w-4" />
              {summary.pendingCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="hidden border-b border-gray-200 bg-gray-50 px-4 py-2.5 md:block">
          <div className="grid grid-cols-12 gap-4 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-600">
            <div className="col-span-4 text-left">Despesa</div>
            <div className="col-span-2">Valor</div>
            <div className="col-span-2">Sua parte</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Ações</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <Card className="m-3 rounded-xl border-dashed border-gray-300">
            <CardContent className="p-6 text-center">
              <WalletCards className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-700">Nenhuma despesa encontrada</p>
              <p className="text-xs text-gray-500">Ajuste os filtros para ver outros resultados.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p className="text-sm text-gray-600">
          Exibindo <span className="font-semibold">{filteredExpenses.length}</span> de{" "}
          <span className="font-semibold">{expenses.length}</span> despesas
        </p>
        <Badge variant="secondary">Página 1</Badge>
      </div>

      <Button
        onClick={onAddExpenseClick}
        className="fixed bottom-24 right-4 h-12 w-12 rounded-full bg-blue-600 p-0 shadow-lg hover:bg-blue-700 md:hidden"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ExpenseList;
