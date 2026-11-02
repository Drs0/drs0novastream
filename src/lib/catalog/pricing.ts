import type { PriceSummary, VariantSelectionState } from '@/types/catalog';
import type { AccessType, ServiceVariantRow } from '@/types/database';

/**
 * Returns the effective price in integer MAD for a variant.
 * Discount price is used only when strictly lower than regular price.
 */
export function getEffectiveVariantPriceMad(variant: ServiceVariantRow): number {
  if (
    variant.sale_price_mad !== null &&
    variant.sale_price_mad >= 0 &&
    variant.sale_price_mad < variant.price_mad
  ) {
    return variant.sale_price_mad;
  }
  return variant.price_mad;
}

/**
 * Computes catalog card price summary across all variants of a service.
 * Never fabricates prices.
 */
export function computeServicePriceSummary(variants: ServiceVariantRow[]): PriceSummary {
  if (!variants || variants.length === 0) {
    return {
      minPriceMad: null,
      maxPriceMad: null,
      hasSingleVariant: false,
      hasDiscount: false,
      availableCount: 0,
      totalCount: 0,
    };
  }

  const availableVariants = variants.filter((v) => v.is_available);
  const pool = availableVariants.length > 0 ? availableVariants : variants;
  const prices = pool.map(getEffectiveVariantPriceMad);
  const minPriceMad = Math.min(...prices);
  const maxPriceMad = Math.max(...prices);
  const hasDiscount = pool.some(
    (v) => v.sale_price_mad !== null && v.sale_price_mad < v.price_mad
  );

  return {
    minPriceMad,
    maxPriceMad,
    hasSingleVariant: variants.length === 1,
    hasDiscount,
    availableCount: availableVariants.length,
    totalCount: variants.length,
  };
}

export interface VariantDimensionValues {
  platforms: string[];
  editions: string[];
  tiers: string[];
  durations: number[];
  accessTypes: ('Primary' | 'Secondary')[];
}

/**
 * Extracts only the dimensions actually used by a service's variants.
 * E.g. Primary/Secondary will never appear for a music/streaming subscription.
 */
export function extractServiceVariantDimensions(
  variants: ServiceVariantRow[]
): VariantDimensionValues {
  const platforms = Array.from(
    new Set(variants.map((v) => v.platform).filter((v): v is string => Boolean(v)))
  );
  const editions = Array.from(
    new Set(variants.map((v) => v.edition).filter((v): v is string => Boolean(v)))
  );
  const tiers = Array.from(
    new Set(variants.map((v) => v.tier).filter((v): v is string => Boolean(v)))
  );
  const durations = Array.from(
    new Set(
      variants
        .map((v) => v.duration_months)
        .filter((v): v is number => typeof v === 'number' && v > 0)
    )
  ).sort((a, b) => a - b);
  const accessTypes = Array.from(
    new Set(
      variants
        .map((v) => v.access_type)
        .filter((v): v is 'Primary' | 'Secondary' => v === 'Primary' || v === 'Secondary')
    )
  );

  return {
    platforms,
    editions,
    tiers,
    durations,
    accessTypes,
  };
}

/**
 * Checks whether a specific attribute value is compatible with the other currently selected attributes.
 * Returns { exists, isAvailable } so invalid combinations are disabled and never fabricate a price.
 */
export function checkOptionCompatibility(
  variants: ServiceVariantRow[],
  currentSelection: VariantSelectionState,
  dimension: keyof VariantSelectionState,
  candidateValue: string | number | AccessType
): { exists: boolean; isAvailable: boolean } {
  const matching = variants.filter((v) => {
    const testSelection: VariantSelectionState = {
      ...currentSelection,
      [dimension]: candidateValue,
    };

    if (
      testSelection.platform !== undefined &&
      testSelection.platform !== null &&
      v.platform !== testSelection.platform
    ) {
      return false;
    }
    if (
      testSelection.edition !== undefined &&
      testSelection.edition !== null &&
      v.edition !== testSelection.edition
    ) {
      return false;
    }
    if (
      testSelection.tier !== undefined &&
      testSelection.tier !== null &&
      v.tier !== testSelection.tier
    ) {
      return false;
    }
    if (
      testSelection.duration_months !== undefined &&
      testSelection.duration_months !== null &&
      v.duration_months !== testSelection.duration_months
    ) {
      return false;
    }
    if (
      testSelection.access_type !== undefined &&
      testSelection.access_type !== null &&
      v.access_type !== testSelection.access_type
    ) {
      return false;
    }
    return true;
  });

  return {
    exists: matching.length > 0,
    isAvailable: matching.some((m) => m.is_available),
  };
}

/**
 * Resolves the exact matching database variant for the current selection.
 * Returns null if zero or more than one variant matches (never fabricates a price).
 */
export function resolveExactVariant(
  variants: ServiceVariantRow[],
  selection: VariantSelectionState,
  dimensions: VariantDimensionValues
): ServiceVariantRow | null {
  if (variants.length === 1) {
    return variants[0];
  }

  const candidates = variants.filter((v) => {
    if (dimensions.platforms.length > 0 && v.platform !== (selection.platform ?? null)) {
      return false;
    }
    if (dimensions.editions.length > 0 && v.edition !== (selection.edition ?? null)) {
      return false;
    }
    if (dimensions.tiers.length > 0 && v.tier !== (selection.tier ?? null)) {
      return false;
    }
    if (
      dimensions.durations.length > 0 &&
      v.duration_months !== (selection.duration_months ?? null)
    ) {
      return false;
    }
    if (
      dimensions.accessTypes.length > 0 &&
      v.access_type !== (selection.access_type ?? null)
    ) {
      return false;
    }
    return true;
  });

  if (candidates.length === 1) {
    return candidates[0];
  }
  return null;
}

