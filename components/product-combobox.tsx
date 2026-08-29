"use client";

import { useMemo, useState } from "react";

export function ProductCombobox({
  products,
}: {
  products: { id: number; code: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId],
  );

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return products.slice(0, 8);

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.code.toLowerCase().includes(keyword)
      );
    });
  }, [products, query]);

  const handleSelect = (product: { id: number; code: string; name: string }) => {
    setSelectedId(product.id);
    setQuery(product.name);
  };

  return (
    <div className="text-sm text-slate-300 lg:col-span-2">
      <label className="block">
        Sản phẩm *
        <div className="relative mt-2">
          <input
            value={selectedProduct ? selectedProduct.name : query}
            onChange={(event) => {
              setSelectedId(null);
              setQuery(event.target.value);
            }}
            placeholder="Chọn hoặc tìm sản phẩm"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-400"
          />
          {filteredProducts.length > 0 && !selectedProduct ? (
            <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-1 shadow-lg">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                >
                  <span>{product.name}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {product.code}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </label>

      <input
        type="hidden"
        name="productName"
        value={selectedProduct?.name ?? query.trim()}
      />
      <input
        type="hidden"
        name="productCode"
        value={selectedProduct?.code ?? ""}
      />

      <p className="mt-2 text-xs text-slate-400">
        {selectedProduct
          ? `Đã chọn: ${selectedProduct.name} (${selectedProduct.code})`
          : "Chọn một sản phẩm có sẵn trong danh sách."}
      </p>
    </div>
  );
}
