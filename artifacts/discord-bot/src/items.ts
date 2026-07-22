export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

export const ITEMS: Item[] = [
  { id: "draco",   name: "Draco",   description: "Draco pistol",     price: 2000, emoji: "🔫" },
  { id: "arp",     name: "ARP",     description: "ARP rifle",        price: 1500, emoji: "🪖" },
  { id: "glock17", name: "Glock 17", description: "Glock 17 pistol", price: 800,  emoji: "🔫" },
  { id: "glock40", name: "Glock 40", description: "Glock 40 pistol", price: 850,  emoji: "🔫" },
  { id: "knife",   name: "Knife",   description: "Tactical knife",   price: 50,   emoji: "🔪" },
];

export const ITEM_MAP = new Map<string, Item>(ITEMS.map((i) => [i.id, i]));
