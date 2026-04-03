import { ReceiptGallery } from "@/components/receipts/ReceiptGallery";
import type { ReceiptItem } from "@/types/receipt";

const initialReceipts: ReceiptItem[] = [
  {
    id: "rec-1",
    title: "Compras do mercado",
    amount: 12780,
    date: "2026-03-15",
    category: "mercado",
    categoryEmoji: "🛒",
    linkedExpenseId: "exp-1",
    fileType: "image",
    previewLabel: "MERCADO",
  },
  {
    id: "rec-2",
    title: "Conta de luz",
    amount: 18000,
    date: "2026-03-14",
    category: "moradia",
    categoryEmoji: "⚡",
    linkedExpenseId: "exp-2",
    fileType: "image",
    previewLabel: "ENERGIA",
  },
  {
    id: "rec-3",
    title: "Jantar",
    amount: 8540,
    date: "2026-03-13",
    category: "alimentacao",
    categoryEmoji: "🍕",
    fileType: "image",
    previewLabel: "JANTAR",
  },
  {
    id: "rec-4",
    title: "Posto de gasolina",
    amount: 7500,
    date: "2026-03-12",
    category: "transporte",
    categoryEmoji: "🚗",
    linkedExpenseId: "exp-5",
    fileType: "pdf",
    previewLabel: "PDF",
  },
];

export const Receipts = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <ReceiptGallery initialReceipts={initialReceipts} />
    </div>
  );
};

export default Receipts;
