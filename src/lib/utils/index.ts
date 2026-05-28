/**
 * Shared utility functions
 */

// ── Item display utilities ────────────────────────────────────────────────────

/**
 * Brand color for an item slot type.
 * Used for borders, tier badges, and slot strips across all item displays.
 */
export function itemSlotColor(slotType?: string): string {
  if (slotType === 'weapon')   return '#f97316';
  if (slotType === 'spirit')   return '#a855f7';
  if (slotType === 'vitality') return '#22c55e';
  return '#4b5563';
}

/**
 * Tier badge HTML — absolute top-right corner of the item container.
 * Uses Roman numerals (I–IV) on a slot-type-colored background.
 * Drop this inside any `relative` item wrapper.
 */
export function renderItemTierBadge(item: { item_tier?: number; item_slot_type?: string }): string {
  const ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
  const tier = item.item_tier;
  if (!tier || !ROMAN[tier]) return '';
  const bg = itemSlotColor(item.item_slot_type);
  return `<span class="absolute top-0 right-0 text-[8px] font-bold px-0.5 leading-tight rounded-bl pointer-events-none"
                style="background:${bg};color:#fff;">${ROMAN[tier]}</span>`;
}

// ── General utilities ─────────────────────────────────────────────────────────

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
