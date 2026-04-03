import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SettleUpModal } from "@/components/expenses/SettleUpModal";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { useCreateExpense, useDeleteExpense, useExpenses, useUpdateExpense } from "@/hooks/useExpenses";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Expense } from "@/types/expense";

export const Expenses = () => {
  const { user } = useAuth();
  const expensesQuery = useExpenses();
  const householdQuery = useHousehold();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [editingAmount, setEditingAmount] = useState("0");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    if (expensesQuery.isError) {
      toast.error(getApiErrorMessage(expensesQuery.error, "Falha ao carregar despesas."));
    }
  }, [expensesQuery.isError, expensesQuery.error]);

  const household = householdQuery.data?.data;
  const partner = household?.members.find((member) => member.id !== user?.id) ?? null;

  const expenseMap = useMemo(() => {
    const map = new Map<string, (typeof expensesQuery.data.data)[number]>();
    for (const expense of expensesQuery.data?.data ?? []) {
      map.set(expense.id, expense);
    }
    return map;
  }, [expensesQuery.data]);

  const uiExpenses = useMemo<Expense[]>(() => {
    return (expensesQuery.data?.data ?? []).map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      paidBy: expense.paidBy === user?.id ? "me" : "partner",
      splitRatio: expense.splitRatio,
      date: expense.date,
      partnerName: partner?.name ?? "Parceiro",
      status: expense.paidBy === user?.id ? "quitado" : "pendente",
      receiptUrl: expense.receiptUrl ?? undefined,
    }));
  }, [expensesQuery.data, partner?.name, user?.id]);

  const handleAddExpense = async (expense: Expense) => {
    if (!user || !partner) {
      toast.error("Nao foi possivel identificar os membros da casa.");
      return;
    }

    try {
      await createExpense.mutateAsync({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        paidBy: expense.paidBy === "me" ? user.id : partner.id,
        splitRatio: expense.splitRatio,
        date: expense.date,
      });
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao adicionar despesa."));
    }
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditingDescription(expense.description);
    setEditingAmount(String(expense.amount / 100));
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense) return;

    const apiExpense = expenseMap.get(editingExpense.id);
    if (!apiExpense) {
      toast.error("Despesa nao encontrada para atualizar.");
      return;
    }

    const parsedAmount = Math.round(Number(editingAmount.replace(",", ".")) * 100);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Informe um valor valido.");
      return;
    }

    try {
      await updateExpense.mutateAsync({
        id: apiExpense.id,
        description: editingDescription,
        amount: parsedAmount,
      });
      setEditingExpense(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao atualizar despesa."));
    }
  };

  const handleDeleteExpense = async () => {
    if (!deleteTarget) return;
    const apiExpense = expenseMap.get(deleteTarget.id);
    if (!apiExpense) {
      toast.error("Despesa nao encontrada para remover.");
      return;
    }

    try {
      await deleteExpense.mutateAsync(apiExpense.id);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao remover despesa."));
    }
  };

  const handleConfirmSettleUp = () => {
    toast.info("A baixa de pagamento por despesa sera adicionada na proxima etapa.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      {expensesQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <ExpenseList
          expenses={uiExpenses}
          onAddExpenseClick={() => setIsAddModalOpen(true)}
          onSettleUpClick={() => setIsSettleUpOpen(true)}
          onEditExpense={handleOpenEdit}
          onDeleteExpense={setDeleteTarget}
        />
      )}

      <AddExpenseModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddExpense={handleAddExpense}
        partnerName={partner?.name ?? "Parceiro"}
      />
      <SettleUpModal
        open={isSettleUpOpen}
        onOpenChange={setIsSettleUpOpen}
        currentBalance={0}
        partnerName={partner?.name ?? "Parceiro"}
        onConfirmPayment={handleConfirmSettleUp}
      />

      <Dialog open={Boolean(editingExpense)} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar despesa</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="expense-description-edit">Descricao</Label>
              <Input
                id="expense-description-edit"
                value={editingDescription}
                onChange={(event) => setEditingDescription(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="expense-amount-edit">Valor (R$)</Label>
              <Input
                id="expense-amount-edit"
                value={editingAmount}
                onChange={(event) => setEditingAmount(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExpense(null)}>Cancelar</Button>
            <Button onClick={handleUpdateExpense} disabled={updateExpense.isPending}>
              Salvar alteracoes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover despesa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense} disabled={deleteExpense.isPending}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expenses;
