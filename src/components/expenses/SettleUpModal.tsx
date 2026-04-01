import { useEffect, useMemo, useState } from "react";
import { HandCoins, PencilLine } from "lucide-react";
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
import { formatCurrencyBRL } from "@/lib/formatters";

interface SettleUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  partnerName: string;
  onConfirmPayment: (amount: number) => void;
}

const formatInputValue = (value: number) => value.toFixed(2);

export const SettleUpModal = ({
  open,
  onOpenChange,
  currentBalance,
  partnerName,
  onConfirmPayment,
}: SettleUpModalProps) => {
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [amountInput, setAmountInput] = useState("0.00");

  const debtAmount = useMemo(() => Math.abs(currentBalance), [currentBalance]);
  const parsedAmount = useMemo(() => {
    const normalized = amountInput.replace(",", ".");
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric) || numeric <= 0) return 0;
    return numeric;
  }, [amountInput]);

  useEffect(() => {
    if (!open) return;
    setIsEditingAmount(false);
    setAmountInput(formatInputValue(debtAmount));
  }, [open, debtAmount]);

  const canConfirm = debtAmount > 0 && parsedAmount > 0 && parsedAmount <= debtAmount;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirmPayment(parsedAmount);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <HandCoins className="h-5 w-5 text-blue-600" />
          </div>
          <DialogTitle>Confirmar acerto de contas</DialogTitle>
          <DialogDescription>
            Confirme o valor pago por fora do app para atualizar o saldo com {partnerName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-slate-600">Saldo atual</p>
            <p className="text-lg font-semibold text-slate-900">{formatCurrencyBRL(currentBalance)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="settle-amount">Valor pago</Label>
              <Button
                type="button"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => setIsEditingAmount((prev) => !prev)}
              >
                <PencilLine className="mr-1 h-3.5 w-3.5" />
                {isEditingAmount ? "Valor total" : "Editar valor"}
              </Button>
            </div>
            <Input
              id="settle-amount"
              inputMode="decimal"
              disabled={!isEditingAmount}
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
            />
            <p className="text-xs text-slate-500">
              Por padrão, usamos o valor total da dívida. Edite apenas se o pagamento foi parcial.
            </p>
            {parsedAmount > debtAmount && (
              <p className="text-xs text-red-600">O valor não pode ser maior que o saldo em aberto.</p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={!canConfirm} onClick={handleConfirm}>
            Confirmar pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUpModal;
