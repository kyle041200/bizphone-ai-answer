import catalog from "@/data/deliverables.json";

const images = import.meta.glob<string>("../assets/library/*.jpg", { eager: true, import: "default", query: "?url" });

export type Category = "Marketing" | "Business Support" | "Sales";
export type Deliverable = {
  id: string;
  title: string;
  description: string;
  category: Category;
  subcategory: string;
  bricksMin: number;
  bricksMax: number;
  sourcePage: number;
  image: string;
};

export const deliverables = catalog as Deliverable[];
export const categories: Category[] = ["Marketing", "Sales", "Business Support"];

export const salesFeaturedIds = ["deliverable-155", "deliverable-157", "deliverable-162", "deliverable-158", "deliverable-170", "deliverable-167", "deliverable-169", "deliverable-161"];
export const supportFeaturedIds = ["deliverable-083", "deliverable-080", "deliverable-082", "deliverable-087", "deliverable-090", "deliverable-105", "deliverable-129", "deliverable-118"];

export function featuredDeliverables(ids: string[]) {
  return ids.map(id => {
    const item = deliverables.find(entry => entry.id === id);
    if (!item) throw new Error(`Unknown featured deliverable: ${id}`);
    return item;
  });
}

export function deliverableImage(item: Deliverable) {
  return images[`../assets/library/${item.image}.jpg`];
}

export function brickAmount(item: Deliverable) {
  const minimum = item.bricksMin.toLocaleString("en-US");
  return item.bricksMax === item.bricksMin ? minimum : `${minimum}–${item.bricksMax.toLocaleString("en-US")}`;
}

export function filterDeliverables(query: string, category: string, subcategory: string, sort: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const result = deliverables.filter(item => {
    const text = `${item.title} ${item.description} ${item.category} ${item.subcategory}`.toLowerCase();
    return terms.every(term => text.includes(term)) && (category === "All" || item.category === category) && (subcategory === "All" || item.subcategory === subcategory);
  });
  if (sort === "bricks-low") return result.sort((a, b) => a.bricksMin - b.bricksMin || a.bricksMax - b.bricksMax);
  if (sort === "bricks-high") return result.sort((a, b) => b.bricksMax - a.bricksMax || b.bricksMin - a.bricksMin);
  if (sort === "name") return result.sort((a, b) => a.title.localeCompare(b.title));
  return result;
}