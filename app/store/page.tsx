import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import StoreClient, { type Product } from './StoreClient';

export const metadata: Metadata = {
  title: 'Store — Official Tatulogue Merch | Tatulogue',
  description:
    'Official Tatulogue merch — tees, hoodies, and hats for tattoo artists and collectors. Printed on demand, shipped to your door.',
  openGraph: {
    title: 'Tatulogue Store',
    description: 'Official Tatulogue merch for tattoo artists and collectors.',
    url: 'https://tatulogue.com/store',
  },
};

function getProducts(): Product[] {
  const filePath = path.join(process.cwd(), 'content', 'store', 'products.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as Product[]) : [];
}

export default function StorePage() {
  const products = getProducts();
  return <StoreClient products={products} />;
}
