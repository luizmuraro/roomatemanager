import { HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrencyBRL } from "@/lib/formatters";

interface SettleUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current balance in reais. Negative = you owe; positive = you're owed. */
  currentBalance: number;
  partnerName: string;
  onConfirmPayment: () => void;
  isConfirming?: boolean;
}

export const SettleUpModal = ({
  open,
  onOpenChange,
  currentBalance,
  partnerName,
  onConfirmPayment,
  isConfirming = false,
}: SettleUpModalProps) => {
  const debtAmount = Math.abs(currentBalance);
  const owes = currentBalance < 0;
  const canConfirm = debtAmount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <HandCoins className="h-5 w-5 text-blue-600" />
          </div>
          <DialogTitle>Confirmar acerto de contas</DialogTitle>
          <DialogDescription>
            {canConfirm
              ? `Isto registra a quitação total do saldo com ${partnerName} e zera as contas.`
              : `Não há saldo em aberto com ${partnerName}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-slate-600">{owes ? "Você deve" : "Você recebe"}</p>
            <p className="text-lg font-semibold text-slate-900">{formatCurrencyBRL(debtAmount)}</p>
          </div>
          <p className="text-xs text-slate-500">
            O saldo será zerado após o registro. Pagamentos parciais serão adicionados em uma etapa futura.
          </p>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!canConfirm || isConfirming}
            onClick={onConfirmPayment}
          >
            {isConfirming ? "Registrando..." : "Confirmar pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUpModal;
