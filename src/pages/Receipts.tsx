import { ReceiptGallery } from "@/components/receipts/ReceiptGallery";
import { mockReceipts } from "@/lib/mock-data";

export const Receipts = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <ReceiptGallery initialReceipts={mockReceipts} />
    </div>
  );
};

export default Receipts;
