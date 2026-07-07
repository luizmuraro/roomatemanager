import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { expenseCategoryEmojiMap, expenseCategoryStyleMap } from "@/lib/expense";
import { formatCurrencyBRLFromCents, formatDateBR } from "@/lib/formatters";
import type { Receipt } from "@/types/receipt";
import { FileText, Link2, Trash2, Unlink2 } from "lucide-react";

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete?: (receipt: Receipt) => void;
}

export const ReceiptCard = ({ receipt, onDelete }: ReceiptCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-slate-200">
        {receipt.fileType === "pdf" ? (
          <FileText className="h-10 w-10 text-red-500" />
        ) : (
          <img src={receipt.fileUrl} alt={receipt.title} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-900">{receipt.title}</p>
          <Badge className={expenseCategoryStyleMap[receipt.category].badgeClassName}>
            {expenseCategoryEmojiMap[receipt.category]}
          </Badge>
        </div>

        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Valor:</span>
            <span className="font-medium text-gray-900">
              {receipt.amount === null ? "—" : formatCurrencyBRLFromCents(receipt.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Data:</span>
            <span>{formatDateBR(receipt.date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Vínculo:</span>
            {receipt.linkedExpenseId ? (
              <span className="inline-flex items-center gap-1 text-blue-600">
                <Link2 className="h-3 w-3" />#{receipt.linkedExpenseId}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-red-600">
                <Unlink2 className="h-3 w-3" />Sem vínculo
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-600 hover:text-red-700"
            onClick={() => onDelete?.(receipt)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
