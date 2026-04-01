import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { expenseCategoryOptions } from "@/lib/expense";
import { formatCurrencyBRLFromCents } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Expense, ExpenseCategory, ExpenseDraft } from "@/types/expense";
import { Receipt, Sparkles } from "lucide-react";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: Expense) => void;
  partnerName: string;
}

const getTodayBRDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

const toIsoDate = (date: string) => {
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return new Date().toISOString().slice(0, 10);
  }
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const normalizeDateInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const initialDraft = (): ExpenseDraft => ({
  description: "",
  amount: "",
  category: "outros",
  paidBy: "me",
  date: getTodayBRDate(),
  splitType: "equal",
  splitRatio: 0.5,
});

export const AddExpenseModal = ({ open, onOpenChange, onAddExpense, partnerName }: AddExpenseModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [draft, setDraft] = useState<ExpenseDraft>(initialDraft());

  useEffect(() => {
    if (open) {
      setStep(1);
      setDraft(initialDraft());
    }
  }, [open]);

  const amountCents = useMemo(() => {
    const numericAmount = Number(draft.amount.replace(",", ".")) || 0;
    return Math.round(numericAmount * 100);
  }, [draft.amount]);

  const mySplitCents = useMemo(() => Math.round(amountCents * draft.splitRatio), [amountCents, draft.splitRatio]);
  const partnerSplitCents = Math.max(0, amountCents - mySplitCents);

  const canContinue = draft.description.trim().length > 2 && amountCents > 0;

  const handleSubmit = () => {
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      description: draft.description.trim(),
      amount: amountCents,
      category: draft.category,
      paidBy: draft.paidBy,
      splitRatio: draft.splitRatio,
      date: toIsoDate(draft.date),
      partnerName,
      status: "pendente",
    };

    onAddExpense(expense);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-left">Adicionar nova despesa</DialogTitle>
              <DialogDescription className="text-left">Etapa {step} de 2</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="expense-description">Descrição</Label>
                <Input
                  id="expense-description"
                  placeholder="Ex.: Compras do mercado"
                  value={draft.description}
                  onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="expense-amount">Valor total (R$)</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={draft.amount}
                    onChange={(event) => setDraft((prev) => ({ ...prev, amount: event.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="expense-category">Categoria</Label>
                  <Select
                    value={draft.category}
                    onValueChange={(value) =>
                      setDraft((prev) => ({ ...prev, category: value as ExpenseCategory }))
                    }
                  >
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="expense-date">Data</Label>
                  <Input
                    id="expense-date"
                    placeholder="DD/MM/AAAA"
                    value={draft.date}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        date: normalizeDateInput(event.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="expense-paid-by">Quem pagou</Label>
                  <Select
                    value={draft.paidBy}
                    onValueChange={(value) => setDraft((prev) => ({ ...prev, paidBy: value as "me" | "partner" }))}
                  >
                    <SelectTrigger id="expense-paid-by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="me">Você</SelectItem>
                      <SelectItem value="partner">{partnerName}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Como dividir essa despesa?</h3>

              <RadioGroup
                value={draft.splitType}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    splitType: value as "equal" | "custom",
                    splitRatio: value === "equal" ? 0.5 : prev.splitRatio,
                  }))
                }
                className="space-y-3"
              >
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                  <RadioGroupItem value="equal" className="mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Dividir igualmente</p>
                    <p className="text-sm text-gray-600">Cada um paga 50% do valor total.</p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 hover:bg-gray-50">
                  <RadioGroupItem value="custom" className="mt-1" />
                  <div className="w-full">
                    <p className="font-medium text-gray-900">Divisão personalizada</p>
                    <p className="text-sm text-gray-600">Defina um percentual diferente para cada pessoa.</p>
                    {draft.splitType === "custom" && (
                      <div className="mt-3 space-y-2">
                        <Slider
                          value={[Math.round(draft.splitRatio * 100)]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(values) =>
                            setDraft((prev) => ({
                              ...prev,
                              splitRatio: values[0] / 100,
                            }))
                          }
                        />
                        <p className="text-xs text-gray-500">Sua parte: {Math.round(draft.splitRatio * 100)}%</p>
                      </div>
                    )}
                  </div>
                </label>
              </RadioGroup>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Você</span>
                  <span className="font-semibold text-gray-900">{formatCurrencyBRLFromCents(mySplitCents)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{partnerName}</span>
                  <span className="font-semibold text-gray-900">{formatCurrencyBRLFromCents(partnerSplitCents)}</span>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-yellow-800">
                  <Sparkles className="h-4 w-4" />
                  Em breve: leitura inteligente de comprovantes
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:justify-between">
          <Button variant="outline" onClick={() => (step === 1 ? onOpenChange(false) : setStep(1))}>
            {step === 1 ? "Cancelar" : "Voltar"}
          </Button>

          {step === 1 ? (
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={!canContinue} onClick={() => setStep(2)}>
              Continuar
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={amountCents <= 0} onClick={handleSubmit}>
              Adicionar despesa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;