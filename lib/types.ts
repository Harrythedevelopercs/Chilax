// ─── WooCommerce API Types ───────────────────────────────────────────

export interface WCImage {
  id: number;
  date_created: string;
  date_modified: string;
  src: string;
  name: string;
  alt: string;
}

// ─── Category ────────────────────────────────────────────────────────

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: WCImage | null;
  menu_order: number;
  count: number;
}

export interface WCCategoryTree extends WCCategory {
  children: WCCategoryTree[];
}

// ─── Product ─────────────────────────────────────────────────────────

export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WCProductDimensions {
  length: string;
  width: string;
  height: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  categories: WCProductCategory[];
  images: WCImage[];
  attributes: WCProductAttribute[];
  dimensions: WCProductDimensions;
  weight: string;
  date_created: string;
  date_modified: string;
}

// ─── API Query Params ────────────────────────────────────────────────

export interface WCCategoryParams {
  per_page?: number;
  page?: number;
  parent?: number;
  orderby?: "id" | "include" | "name" | "slug" | "term_group" | "description" | "count";
  order?: "asc" | "desc";
  hide_empty?: boolean;
  search?: string;
}

export interface WCProductParams {
  per_page?: number;
  page?: number;
  category?: number;
  search?: string;
  orderby?: "date" | "id" | "include" | "title" | "slug" | "price" | "popularity" | "rating";
  order?: "asc" | "desc";
  status?: "draft" | "pending" | "private" | "publish" | "any";
  featured?: boolean;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tag?: number;
}
