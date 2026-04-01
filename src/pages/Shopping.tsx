import { ShoppingList } from "@/components/shopping/ShoppingList";
import { mockShoppingItems } from "@/lib/mock-data";

export const Shopping = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <ShoppingList initialItems={mockShoppingItems} />
    </div>
  );
};

export default Shopping;
