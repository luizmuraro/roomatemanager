import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReceiptFilters, type SortMode } from "@/hooks/useReceiptFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReceiptItem } from "@/types/receipt";
import { FileUp, LayoutGrid, List, Upload } from "lucide-react";
import { ReceiptCard } from "./ReceiptCard";

interface ReceiptGalleryProps {
  initialReceipts: ReceiptItem[];
}

type ViewMode = "grid" | "list";

export const ReceiptGallery = ({ initialReceipts }: ReceiptGalleryProps) => {
  const [receipts, setReceipts] = useState<ReceiptItem[]>(initialReceipts);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { activeFilter, setActiveFilter, sortMode, setSortMode, filteredReceipts, unlinkedCount } =
    useReceiptFilters(receipts);

  const triggerUpload = () => fileInputRef.current?.click();

  const onUploadFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newReceipts: ReceiptItem[] = Array.from(files).map((file, index) => ({
      id: `new-rec-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      category: "outros",
      categoryEmoji: "📦",
      fileType: file.type.includes("pdf") ? "pdf" : "image",
      previewLabel: file.type.includes("pdf") ? "PDF" : "NOVO",
    }));

    setReceipts((prev) => [...newReceipts, ...prev]);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Galeria de comprovantes</h1>
          <p className="text-sm text-gray-600">Organize e visualize todos os comprovantes das despesas</p>
        </div>
        <Button className="hidden bg-blue-600 hover:bg-blue-700 md:inline-flex" onClick={triggerUpload}>
          <Upload className="h-4 w-4" />
          Enviar comprovante
        </Button>
      </div>

      <Card className="rounded-lg border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <button
            onClick={triggerUpload}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50"
          >
            <FileUp className="mx-auto h-7 w-7 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600">Clique para enviar</span> ou arraste arquivos
            </p>
            <p className="text-xs text-gray-500">PNG, JPG e PDF até 10MB</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            className="hidden"
            onChange={(event) => onUploadFiles(event.target.files)}
          />
        </CardContent>
      </Card>

      <Card className="rounded-lg border-gray-200 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant={activeFilter === "all" ? "default" : "outline"} onClick={() => setActiveFilter("all")}>Todos ({receipts.length})</Button>
            <Button variant={activeFilter === "recent" ? "default" : "outline"} onClick={() => setActiveFilter("recent")}>Recentes</Button>
            <Button variant={activeFilter === "mercado" ? "default" : "outline"} onClick={() => setActiveFilter("mercado")}>Mercado</Button>
            <Button variant={activeFilter === "moradia" ? "default" : "outline"} onClick={() => setActiveFilter("moradia")}>Moradia</Button>
            <Button variant={activeFilter === "unlinked" ? "default" : "outline"} onClick={() => setActiveFilter("unlinked")}>Sem vínculo ({unlinkedCount})</Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Ordenar por data</SelectItem>
                <SelectItem value="amount">Ordenar por valor</SelectItem>
                <SelectItem value="category">Ordenar por categoria</SelectItem>
              </SelectContent>
            </Select>

            <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
        {filteredReceipts.map((receipt) => (
          <ReceiptCard key={receipt.id} receipt={receipt} />
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
        Exibindo <span className="font-medium">1-{filteredReceipts.length}</span> de <span className="font-medium">{receipts.length}</span> comprovantes
      </div>

      <Button onClick={triggerUpload} className="fixed bottom-24 right-4 h-12 w-12 rounded-full bg-blue-600 p-0 shadow-lg hover:bg-blue-700 md:hidden" aria-label="Enviar comprovante">
        <Upload className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ReceiptGallery;
