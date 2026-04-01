import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ShoppingItem as ShoppingItemType } from "@/types/shopping";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { ShoppingItem } from "./ShoppingItem";

interface ShoppingListProps {
  initialItems: ShoppingItemType[];
}

type FilterType = "all" | "pending" | "completed";

const getItemEmoji = (name: string) => {
  const lower = name.toLowerCase();
  if (/(leite|iogurte|queijo|manteiga)/.test(lower)) return "🥛";
  if (/(banana|ma[cç]a|tomate|alface|cenoura|verdura)/.test(lower)) return "🥬";
  if (/(frango|carne|peixe)/.test(lower)) return "🥩";
  if (/(p[aã]o|arroz|macarr[aã]o|farinha|azeite)/.test(lower)) return "🥫";
  if (/(detergente|sabonete|shampoo|papel|limpeza)/.test(lower)) return "🧽";
  return "📦";
};

export const ShoppingList = ({ initialItems }: ShoppingListProps) => {
  const [items, setItems] = useState<ShoppingItemType[]>(initialItems);
  const [quickAdd, setQuickAdd] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => item.checked).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [items]);

  const visibleItems = useMemo(() => {
    if (filter === "pending") return items.filter((item) => !item.checked);
    if (filter === "completed") return items.filter((item) => item.checked);
    return items;
  }, [items, filter]);

  const addItem = () => {
    const value = quickAdd.trim();
    if (!value) return;

    const newItem: ShoppingItemType = {
      id: `shop-${Date.now()}`,
      name: value,
      quantity: 1,
      unit: "un",
      checked: false,
      addedBy: "me",
      emoji: getItemEmoji(value),
    };

    setItems((prev) => [newItem, ...prev]);
    setQuickAdd("");
  };

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Lista de compras</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
            <p>Lista colaborativa com seu roommate</p>
            <span className="inline-flex items-center gap-1 text-green-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Tempo real
            </span>
          </div>
        </div>
      </div>

      <Card className="rounded-lg border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Plus className="h-4 w-4" />
            </div>
            <Input
              value={quickAdd}
              onChange={(event) => setQuickAdd(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addItem();
              }}
              placeholder="Digite um item e pressione Enter (ex.: Leite, Banana, Pão...)"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Todos ({stats.total})</Button>
            <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>Pendentes ({stats.pending})</Button>
            <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}>Comprados ({stats.completed})</Button>
            <Button variant="outline" className="ml-auto" onClick={clearCompleted}>
              <Trash2 className="mr-1 h-4 w-4" />
              Limpar comprados
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Itens para comprar</h2>
          <Badge variant="secondary">{visibleItems.length} itens</Badge>
        </div>

        <div className="divide-y divide-gray-100">
          {visibleItems.map((item) => (
            <ShoppingItem key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="px-4 py-10 text-center">
            <ListChecks className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-700">Nenhum item nesta visualização</p>
            <p className="text-xs text-gray-500">Adicione itens ou mude o filtro atual.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
