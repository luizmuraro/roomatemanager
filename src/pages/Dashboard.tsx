import { useState } from "react";
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
import { SettleUpModal } from "@/components/expenses/SettleUpModal";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/formatters";
import type { Expense } from "@/types/expense";

const recentActivity = [
  {
    id: 1,
    description: "Compras do mercado",
    paidBy: "Alex",
    amount: 127.8,
    date: "Há 2 horas",
    type: "debit" as const,
    icon: ShoppingBasket,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    description: "Conta de luz",
    paidBy: "Você",
    amount: 180,
    date: "Ontem",
    type: "credit" as const,
    icon: Bolt,
    iconClass: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    description: "Café e lanches",
    paidBy: "Alex",
    amount: 45.2,
    date: "Há 2 dias",
    type: "debit" as const,
    icon: Receipt,
    iconClass: "bg-orange-100 text-orange-600",
  },
];

const categoryBreakdown = [
  { label: "Mercado", amount: 68000, color: "bg-blue-500" },
  { label: "Moradia", amount: 42000, color: "bg-green-500" },
  { label: "Casa", amount: 32000, color: "bg-purple-500" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [yourBalance, setYourBalance] = useState(-245.5);

  const totalSpent = 1850;
  const yourShare = 925;
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

  const handleAddExpense = (_expense: Expense) => {
    setIsAddExpenseOpen(false);
  };

  const handleConfirmSettleUp = (amount: number) => {
    setYourBalance((prev) => {
      if (prev < 0) {
        return Math.min(0, prev + amount);
      }

      if (prev > 0) {
        return Math.max(0, prev - amount);
      }

      return 0;
    });
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
                <p className="mt-1 text-2xl font-bold">
                  {owes ? "-" : isSettled ? "" : "+"}
                  {formatCurrencyBRL(Math.abs(yourBalance))}
                </p>
                <p className="mt-1 text-sm opacity-80">{isSettled ? "Contas em dia" : owes ? "Você deve" : "Devem para você"}</p>
              </div>
              {owes ? <ArrowDown className="h-6 w-6 opacity-90" /> : <ArrowUp className="h-6 w-6 opacity-90" />}
            </div>
          </div>

          <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total gasto</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrencyBRL(totalSpent)}</p>
                <p className="mt-1 text-sm opacity-80">Neste mês</p>
              </div>
              <CreditCard className="h-6 w-6 opacity-90" />
            </div>
          </div>

          <div className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Sua parte</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrencyBRL(yourShare)}</p>
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
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                    <p className="text-sm text-gray-500">Adicionado por {item.paidBy} • {formatCurrencyBRL(item.amount)}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.date}</p>
                  </div>
                  <span className={`text-sm font-medium ${item.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {item.type === "credit" ? "+" : "-"}
                    {formatCurrencyBRL(item.amount / 2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-100">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Saldo da House Share</h2>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-semibold text-white">A</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alex Silva</p>
                  <p className="text-sm text-gray-500">Seu parceiro de casa</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-bold ${owes ? "text-red-600" : "text-green-600"}`}>
                  {isSettled ? "Tudo certo: " : owes ? "Você deve " : "Devem para você "}
                  {formatCurrencyBRL(Math.abs(yourBalance))}
                </p>
                {owes && (
                  <Button
                    size="sm"
                    className="mt-2 h-8 bg-blue-600 px-3 text-xs hover:bg-blue-700"
                    onClick={() => setIsSettleUpOpen(true)}
                  >
                    Fazer pagamento
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-white p-1">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Categorias de despesas</h3>
              <div className="space-y-2">
                {categoryBreakdown.map((category) => (
                  <div key={category.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${category.color}`} />
                      <span className="text-sm text-gray-600">{category.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrencyBRL(category.amount / 100)}</span>
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
        partnerName="Alex Silva"
      />
      <SettleUpModal
        open={isSettleUpOpen}
        onOpenChange={setIsSettleUpOpen}
        currentBalance={yourBalance}
        partnerName="Alex Silva"
        onConfirmPayment={handleConfirmSettleUp}
      />
    </div>
  );
};

export default Dashboard;
