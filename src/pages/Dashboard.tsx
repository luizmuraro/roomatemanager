import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Bolt,
  Camera,
  CreditCard,
  HandCoins,
  ListPlus,
  PiggyBank,
  Receipt,
  ShoppingBasket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SettleUpModal } from "@/components/expenses/SettleUpModal";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { expenseCategoryLabelMap, expenseCategoryStyleMap } from "@/lib/expense";
import { formatCurrencyBRL, formatCurrencyBRLFromCents, formatDateBR } from "@/lib/formatters";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateExpense, useExpenses, useExpenseSummary } from "@/hooks/useExpenses";
import { useHousehold } from "@/hooks/useHousehold";
import type { ExpenseCategory } from "@/types/expense";

const categoryIconMap: Record<ExpenseCategory, typeof ShoppingBasket> = {
  alimentacao: ShoppingBasket,
  moradia: Bolt,
  transporte: CreditCard,
  saude: Receipt,
  lazer: PiggyBank,
  outros: Receipt,
};

const categoryColorMap: Record<ExpenseCategory, string> = {
  alimentacao: "bg-blue-100 text-blue-600",
  moradia: "bg-green-100 text-green-600",
  transporte: "bg-indigo-100 text-indigo-600",
  saude: "bg-red-100 text-red-600",
  lazer: "bg-orange-100 text-orange-600",
  outros: "bg-slate-100 text-slate-600",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const summaryQuery = useExpenseSummary();
  const expensesQuery = useExpenses();
  const householdQuery = useHousehold();
  const createExpense = useCreateExpense();

  useEffect(() => {
    if (summaryQuery.isError) {
      toast.error(getApiErrorMessage(summaryQuery.error, "Falha ao carregar resumo de despesas."));
    }
  }, [summaryQuery.isError, summaryQuery.error]);

  useEffect(() => {
    if (expensesQuery.isError) {
      toast.error(getApiErrorMessage(expensesQuery.error, "Falha ao carregar despesas recentes."));
    }
  }, [expensesQuery.isError, expensesQuery.error]);

  useEffect(() => {
    if (householdQuery.isError) {
      toast.error(getApiErrorMessage(householdQuery.error, "Falha ao carregar dados da casa."));
    }
  }, [householdQuery.isError, householdQuery.error]);

  const allExpenses = expensesQuery.data?.data ?? [];
  const recentExpenses = useMemo(() => allExpenses.slice(0, 5), [allExpenses]);

  const categoryBreakdown = useMemo(() => {
    const totals = new Map<ExpenseCategory, number>();

    for (const expense of allExpenses) {
      const current = totals.get(expense.category) ?? 0;
      totals.set(expense.category, current + expense.amount);
    }

    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [allExpenses]);

  const summaryData = summaryQuery.data?.data;
  const myMember = summaryData?.members.find((member) => member.id === user?.id);
  const yourBalanceCents = myMember?.balanceCents ?? 0;
  const yourBalance = yourBalanceCents / 100;

  const yourShare = useMemo(() => {
    if (!user) return 0;

    return allExpenses.reduce((acc, expense) => {
      const payerShare = Math.round(expense.amount * expense.splitRatio);
      const myShareInCents = expense.paidBy === user.id ? payerShare : expense.amount - payerShare;
      return acc + myShareInCents;
    }, 0);
  }, [allExpenses, user]);

  const totalSpent = useMemo(
    () => allExpenses.reduce((acc, expense) => acc + expense.amount, 0),
    [allExpenses],
  );

  const householdData = householdQuery.data?.data;
  const partner = householdData?.members.find((member) => member.id !== user?.id) ?? null;

  const owes = yourBalance < 0;
  const isSettled = yourBalance === 0;

  const quickActions: Array<{
    icon: typeof ListPlus;
    label: string;
    bg: string;
    color: string;
    onClick?: () => void;
  }> = [
    {
      icon: ListPlus,
      label: "Adicionar despesa",
      bg: "bg-blue-100",
      color: "text-blue-600",
      onClick: () => setIsAddExpenseOpen(true),
    },
    {
      icon: Camera,
      label: "Recibos",
      bg: "bg-green-100",
      color: "text-green-600",
      onClick: () => navigate("/receipts"),
    },
    {
      icon: ShoppingBasket,
      label: "Lista de compras",
      bg: "bg-purple-100",
      color: "text-purple-600",
      onClick: () => navigate("/shopping"),
    },
    {
      icon: HandCoins,
      label: "Acertar contas",
      bg: "bg-orange-100",
      color: "text-orange-600",
      onClick: () => setIsSettleUpOpen(true),
    },
  ];

  const handleAddExpense = async (expense: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    paidBy: "me" | "partner";
    splitRatio: number;
    date: string;
  }) => {
    if (!user || !partner) {
      toast.error("Nao foi possivel identificar os membros da casa.");
      return;
    }

    const paidBy = expense.paidBy === "me" ? user.id : partner.id;

    try {
      await createExpense.mutateAsync({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        paidBy,
        splitRatio: expense.splitRatio,
        date: expense.date,
      });
      setIsAddExpenseOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao adicionar despesa."));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 md:pb-6">
      <div className="rounded-b-3xl bg-primary px-4 pb-8 pt-6 text-primary-foreground md:px-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">Olá, 👋</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm opacity-80">Visão geral das despesas compartilhadas</p>
          </div>
          <button className="relative rounded-full bg-primary-foreground/10 p-2">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Seu balanço</p>
                {summaryQuery.isLoading ? (
                  <Skeleton className="mt-2 h-8 w-36 bg-primary-foreground/30" />
                ) : (
                  <p className="mt-1 text-2xl font-bold">
                    {owes ? "-" : isSettled ? "" : "+"}
                    {formatCurrencyBRL(Math.abs(yourBalance))}
                  </p>
                )}
                <p className="mt-1 text-sm opacity-80">{isSettled ? "Contas em dia" : owes ? "Voce deve" : "Devem para voce"}</p>
              </div>
              {owes ? <ArrowDown className="h-6 w-6 opacity-90" /> : <ArrowUp className="h-6 w-6 opacity-90" />}
            </div>
          </div>

          <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total gasto</p>
                {expensesQuery.isLoading ? (
                  <Skeleton className="mt-2 h-8 w-32 bg-primary-foreground/30" />
                ) : (
                  <p className="mt-1 text-2xl font-bold">{formatCurrencyBRLFromCents(totalSpent)}</p>
                )}
                <p className="mt-1 text-sm opacity-80">Neste mês</p>
              </div>
              <CreditCard className="h-6 w-6 opacity-90" />
            </div>
          </div>

          <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Sua parte</p>
                {expensesQuery.isLoading ? (
                  <Skeleton className="mt-2 h-8 w-32 bg-primary-foreground/30" />
                ) : (
                  <p className="mt-1 text-2xl font-bold">{formatCurrencyBRLFromCents(yourShare)}</p>
                )}
                <p className="mt-1 text-sm opacity-80">50% do total</p>
              </div>
              <PiggyBank className="h-6 w-6 opacity-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-5 space-y-5 px-4 md:px-8">
        <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Ações rápidas</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                disabled={!action.onClick}
                className={`group rounded-lg px-2 py-2 text-center transition-all ${
                  action.onClick
                    ? "hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm"
                    : "cursor-default opacity-80"
                }`}
              >
                <div className={`mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${action.bg}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Atividade recente</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver tudo</button>
            </div>
            <div className="space-y-4">
              {expensesQuery.isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-52" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                : recentExpenses.map((item) => {
                    const Icon = categoryIconMap[item.category] ?? Receipt;
                    const iconClass = categoryColorMap[item.category] ?? "bg-slate-100 text-slate-600";
                    const paidByMe = item.paidBy === user?.id;
                    const payerShare = Math.round(item.amount * item.splitRatio);
                    const myShare = paidByMe ? payerShare : item.amount - payerShare;
                    const payerName = item.paidBy === user?.id ? "Voce" : partner?.name ?? "Parceiro";

                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.description}</p>
                          <p className="text-sm text-gray-500">
                            Adicionado por {payerName} • {formatCurrencyBRLFromCents(item.amount)}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">{formatDateBR(item.date)}</p>
                        </div>
                        <span className={`text-sm font-medium ${paidByMe ? "text-green-600" : "text-red-600"}`}>
                          {paidByMe ? "+" : "-"}
                          {formatCurrencyBRLFromCents(myShare)}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-100">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Saldo da Share House</h2>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-semibold text-white">{partner?.name?.[0] ?? "?"}</span>
                </div>
                <div>
                  {householdQuery.isLoading ? <Skeleton className="h-4 w-28" /> : <p className="font-medium text-gray-900">{partner?.name ?? "Sem parceiro"}</p>}
                  <p className="text-sm text-gray-500">Seu parceiro de casa</p>
                  {householdData?.name ? <p className="text-xs text-gray-500">{householdData.name}</p> : null}
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-bold ${owes ? "text-red-600" : "text-green-600"}`}>
                  {isSettled ? "Tudo certo: " : owes ? "Voce deve " : "Devem para voce "}
                  {formatCurrencyBRL(Math.abs(yourBalance))}
                </p>
                {owes && (
                  <Button
                    size="sm"
                    className="mt-2 h-8 bg-blue-600 px-3 text-xs hover:bg-blue-700"
                    onClick={() => setIsSettleUpOpen(true)}
                  >
                    Registrar pagamento
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-white p-1">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Categorias de despesas</h3>
              <div className="space-y-2">
                {expensesQuery.isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))
                  : categoryBreakdown.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${expenseCategoryStyleMap[category.category].dotClassName}`} />
                      <span className="text-sm text-gray-600">{expenseCategoryLabelMap[category.category]}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrencyBRLFromCents(category.amount)}</span>
                  </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAddExpense={handleAddExpense}
        partnerName={partner?.name ?? "Parceiro"}
      />
      <SettleUpModal
        open={isSettleUpOpen}
        onOpenChange={setIsSettleUpOpen}
        currentBalance={yourBalance}
        partnerName={partner?.name ?? "Parceiro"}
        onConfirmPayment={() => setIsSettleUpOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
