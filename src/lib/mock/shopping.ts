import type { ShoppingItem } from "@/types/shopping";

export const mockShoppingItems: ShoppingItem[] = [
  { id: "shop-1", name: "Banana orgânica", quantity: 1, unit: "kg", checked: false, addedBy: "me", emoji: "🥬" },
  { id: "shop-2", name: "Leite integral", quantity: 1, unit: "L", checked: false, addedBy: "partner", emoji: "🥛" },
  { id: "shop-3", name: "Detergente", quantity: 2, unit: "un", checked: false, addedBy: "me", emoji: "🧽" },
  { id: "shop-4", name: "Peito de frango", quantity: 1, unit: "kg", checked: true, addedBy: "partner", emoji: "🥩" },
  { id: "shop-5", name: "Pão de forma", quantity: 1, unit: "un", checked: false, addedBy: "me", emoji: "🥫" },
  { id: "shop-6", name: "Papel higiênico", quantity: 12, unit: "un", checked: true, addedBy: "me", emoji: "🧽" },
];
