import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ShoppingItem as ShoppingItemType } from "@/types/shopping";
import { Trash2 } from "lucide-react";

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ShoppingItem = ({ item, onToggle, onRemove }: ShoppingItemProps) => {
  const byLabel = item.addedBy === "me" ? "Você" : "Alex";

  return (
    <div className={`group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${item.checked ? "opacity-60" : ""}`}>
      <Checkbox checked={item.checked} onCheckedChange={() => onToggle(item.id)} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`truncate text-sm font-medium text-gray-900 ${item.checked ? "line-through text-gray-500" : ""}`}>
            {item.name}
            {item.quantity > 1 ? ` - ${item.quantity}${item.unit}` : ""}
          </p>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{item.emoji}</Badge>
        </div>
      </div>

      <span className={`text-xs ${item.checked ? "text-green-600" : "text-gray-500"}`}>
        {item.checked ? "Comprado" : byLabel}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-gray-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShoppingItem;
