export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  addedBy: "me" | "roommate";
  emoji: string;
}
