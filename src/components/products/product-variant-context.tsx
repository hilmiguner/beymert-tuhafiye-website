"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { ProductColorVariant } from "@/types/product";

type VariantSelectionContext = {
  activeVariant: ProductColorVariant | null;
  selectVariant: (variant: ProductColorVariant | null) => void;
};

const ProductVariantContext = createContext<VariantSelectionContext | null>(null);

export function ProductVariantProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeVariant, selectVariant] = useState<ProductColorVariant | null>(null);

  return (
    <ProductVariantContext.Provider value={{ activeVariant, selectVariant }}>
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariantSelection() {
  const context = useContext(ProductVariantContext);
  if (!context) {
    throw new Error("Product variant selection must be inside ProductVariantProvider.");
  }
  return context;
}
