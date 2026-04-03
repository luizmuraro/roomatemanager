import { ShoppingList } from "@/components/shopping/ShoppingList";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCreateShoppingItem,
  useDeleteCheckedItems,
  useDeleteShoppingItem,
  useShoppingItems,
  useUpdateShoppingItem,
} from "@/hooks/useShopping";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { ShoppingItem } from "@/types/shopping";
import { useMemo } from "react";

export const Shopping = () => {
  const { user } = useAuth();
  const shoppingQuery = useShoppingItems();
  const createItem = useCreateShoppingItem();
  const updateItem = useUpdateShoppingItem();
  const deleteItem = useDeleteShoppingItem();
  const deleteChecked = useDeleteCheckedItems();

  const itemsById = useMemo(() => {
    const map = new Map<string, (typeof shoppingQuery.data.data)[number]>();
    for (const item of shoppingQuery.data?.data ?? []) {
      map.set(item.id, item);
    }
    return map;
  }, [shoppingQuery.data]);

  const uiItems = useMemo<ShoppingItem[]>(() => {
    return (shoppingQuery.data?.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      checked: item.checked,
      addedBy: item.addedBy === user?.id ? "me" : "partner",
      emoji: "",
    }));
  }, [shoppingQuery.data, user?.id]);

  const handleAdd = async (name: string) => {
    try {
      await createItem.mutateAsync({ name, quantity: 1, unit: "un" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao adicionar item."));
    }
  };

  const handleToggle = async (id: string) => {
    const current = itemsById.get(id);
    if (!current) return;

    try {
      await updateItem.mutateAsync({ id, checked: !current.checked });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao atualizar item."));
    }
  };

  const handleEdit = async (id: string) => {
    const current = itemsById.get(id);
    if (!current) return;

    const nextName = window.prompt("Novo nome do item", current.name)?.trim();
    if (!nextName) return;

    const nextQuantityRaw = window.prompt("Quantidade", String(current.quantity));
    if (!nextQuantityRaw) return;
    const nextQuantity = Number(nextQuantityRaw);
    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      toast.error("Quantidade invalida.");
      return;
    }

    try {
      await updateItem.mutateAsync({ id, name: nextName, quantity: nextQuantity });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao editar item."));
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao remover item."));
    }
  };

  const handleClearChecked = async () => {
    try {
      await deleteChecked.mutateAsync();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao limpar itens marcados."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <ShoppingList
        items={uiItems}
        isLoading={shoppingQuery.isLoading}
        onAddItem={handleAdd}
        onToggleItem={handleToggle}
        onEditItem={handleEdit}
        onRemoveItem={handleRemove}
        onClearCompleted={handleClearChecked}
      />
    </div>
  );
};

export default Shopping;
