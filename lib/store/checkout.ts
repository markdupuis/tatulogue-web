// Same Supabase project + anon key as lib/supabase.ts (re-declared here so this
// module stays dependency-free for client bundles).
const SUPABASE_URL = 'https://wvndcypeecniuzrnwnmx.supabase.co';
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bmRjeXBlZWNuaXV6cm53bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDQ5NjcsImV4cCI6MjA3OTE4MDk2N30.ssbErAc6AMBL5UcZtd3q8YKRkFdS0qdfNmm7bcoHrUo';

const CHECKOUT_ENDPOINT = `${SUPABASE_URL}/functions/v1/store_checkout`;

export interface CheckoutItem {
  sync_variant_id: number;
  quantity: number;
}

export async function startCheckout(items: CheckoutItem[]): Promise<void> {
  const res = await fetch(CHECKOUT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON}`,
      apikey: SUPABASE_ANON,
    },
    body: JSON.stringify({
      items: items.map(({ sync_variant_id, quantity }) => ({ sync_variant_id, quantity })),
    }),
  });

  const body: { url?: string; error?: { message?: string } } = await res
    .json()
    .catch(() => ({}));

  if (!res.ok || !body.url) {
    throw new Error(body.error?.message ?? `Checkout failed (HTTP ${res.status})`);
  }

  window.location.href = body.url;
}
