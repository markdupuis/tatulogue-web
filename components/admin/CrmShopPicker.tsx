'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';
import { createCrmContact, searchShopContacts, type CrmContact } from '../../lib/admin/crm';

export interface ShopSelection {
  shopName: string;
  shopContactId: string | null;
}

interface CrmShopPickerProps {
  value: ShopSelection;
  ownerId: string;
  inputClassName: string;
  onChange: (next: ShopSelection) => void;
  onShopCreated?: (shop: CrmContact) => void;
}

const SEARCH_DEBOUNCE_MS = 200;
const OPTION_CLASS = 'block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.06]';

export default function CrmShopPicker({ value, ownerId, inputClassName, onChange, onShopCreated }: CrmShopPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CrmContact[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const term = value.shopName.trim();

  useEffect(() => {
    if (!isOpen || !term) {
      setResults([]);
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      searchShopContacts(term).then((rows) => {
        if (active) setResults(rows);
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [term, isOpen]);

  const hasExactMatch = results.some((r) => r.display_name.trim().toLowerCase() === term.toLowerCase());
  const canAddShop = Boolean(term) && !hasExactMatch && !value.shopContactId;
  const isDropdownVisible = isOpen && Boolean(term) && (results.length > 0 || canAddShop);

  function handleType(text: string) {
    onChange({ shopName: text, shopContactId: null });
    setIsOpen(true);
  }

  function handleSelect(shop: CrmContact) {
    onChange({ shopName: shop.display_name, shopContactId: shop.id });
    setIsOpen(false);
  }

  async function handleAddShop() {
    setIsCreating(true);
    const created = await createCrmContact({ display_name: term, contact_type: 'shop', owner_user_id: ownerId });
    setIsCreating(false);
    if (!created) {
      window.alert('Could not create that shop. Check the console for details.');
      return;
    }
    onShopCreated?.(created);
    handleSelect(created);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key !== 'Enter' || !isDropdownVisible) return;
    // Enter picks the top suggestion instead of submitting the whole contact form.
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0]);
    else if (canAddShop) handleAddShop();
  }

  return (
    <div className="relative">
      <input
        className={inputClassName}
        value={value.shopName}
        placeholder="Start typing to find a shop"
        onChange={(e) => handleType(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isDropdownVisible}
        aria-autocomplete="list"
      />
      {value.shopContactId && <span className="mt-1 block text-[11px] text-emerald-400">Linked to shop contact</span>}
      {isDropdownVisible && (
        <div role="listbox" className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-[#14141f] shadow-lg">
          {results.map((shop) => (
            <button
              key={shop.id}
              type="button"
              role="option"
              aria-selected={shop.id === value.shopContactId}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(shop)}
              className={OPTION_CLASS}
            >
              {shop.display_name}
              {(shop.city || shop.state) && (
                <span className="ml-2 text-xs text-white/40">{[shop.city, shop.state].filter(Boolean).join(', ')}</span>
              )}
            </button>
          ))}
          {canAddShop && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAddShop}
              disabled={isCreating || !ownerId}
              className={`${OPTION_CLASS} border-t border-white/8 text-violet-300 disabled:opacity-50`}
            >
              {isCreating ? 'Adding shop…' : `+ Add shop "${term}"`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
