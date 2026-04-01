export type ReceiptCategory = "mercado" | "moradia" | "alimentacao" | "transporte" | "saude" | "outros";

export interface ReceiptItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: ReceiptCategory;
  categoryEmoji: string;
  linkedExpenseId?: string;
  fileType: "image" | "pdf";
  previewLabel: string;
}
