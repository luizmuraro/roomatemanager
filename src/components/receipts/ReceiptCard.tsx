import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRLFromCents, formatDateBR } from "@/lib/formatters";
import type { ReceiptItem } from "@/types/receipt";
import { FileText, Link2, Unlink2 } from "lucide-react";

interface ReceiptCardProps {
  receipt: ReceiptItem;
}

const categoryColorClass: Record<ReceiptItem["category"], string> = {
  mercado: "bg-green-100 text-green-700",
  moradia: "bg-yellow-100 text-yellow-700",
  alimentacao: "bg-orange-100 text-orange-700",
  transporte: "bg-blue-100 text-blue-700",
  saude: "bg-pink-100 text-pink-700",
  outros: "bg-gray-100 text-gray-700",
};

export const ReceiptCard = ({ receipt }: ReceiptCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-gray-100 to-slate-200">
        {receipt.fileType === "pdf" ? (
          <FileText className="h-10 w-10 text-red-500" />
        ) : (
          <span className="text-xs font-semibold tracking-widest text-slate-600">{receipt.previewLabel}</span>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-900">{receipt.title}</p>
          <Badge className={categoryColorClass[receipt.category]}>{receipt.categoryEmoji}</Badge>
        </div>

        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Valor:</span>
            <span className="font-medium text-gray-900">{formatCurrencyBRLFromCents(receipt.amount)}</span>
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
      </div>
    </div>
  );
};

export default ReceiptCard;
