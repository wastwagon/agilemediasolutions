export interface Brand {
  id: number;
  name: string;
  description: string | null;
  audience: string | null;
  format: string | null;
  image_url: string | null;
  website_url: string | null;
  order_index: number;
}

export interface BrandPayload {
  name: string;
  description: string;
  audience: string;
  format: string;
  image_url: string;
  website_url: string;
  order_index: number;
}

export interface Service {
  id: number;
  title: string;
  description: string | null;
  highlights: string | null;
  icon: string | null;
  order_index: number;
}

export interface ServicePayload {
  title: string;
  description: string;
  highlights: string;
  icon: string;
  order_index: number;
}

export interface EventItem {
  id: number;
  title: string;
  description: string | null;
  tagline: string | null;
  body: string | null;
  features: string | null;
  audience: string | null;
  image_url: string | null;
  link_url: string | null;
  order_index: number;
}

export interface EventPayload {
  title: string;
  description: string;
  tagline: string;
  body: string;
  features: string;
  audience: string;
  image_url: string;
  link_url: string;
  order_index: number;
}

export interface Sector {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  order_index: number;
}

export interface SectorPayload {
  name: string;
  description: string;
  icon: string;
  image_url: string;
  order_index: number;
}

export interface InsightCategory {
  id: number;
  name: string;
  slug: string;
  order_index: number;
}

export interface InsightCategoryPayload {
  name: string;
  slug: string;
  order_index: number;
}

export interface InsightPost {
  id: number;
  slug: string;
  title: string;
  meta: string | null;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  media_class: string | null;
  published: boolean;
  order_index: number;
  category_id: number | null;
  category: { id: number; name: string; slug: string } | null;
}

export interface InsightPostPayload {
  slug: string;
  title: string;
  meta: string;
  excerpt: string;
  body: string;
  image_url: string;
  media_class: string;
  published: boolean;
  order_index: number;
  category_id: number | null;
}

export interface PageContentCard {
  id: number;
  context: string;
  title: string;
  body: string | null;
  image_url: string | null;
  list_label: string | null;
  list_items: string | null;
  published: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

/** Body for POST (context added by hook) and PUT */
export interface PageContentCardPayload {
  title: string;
  body: string;
  image_url: string;
  list_label: string;
  list_items: string;
  published: boolean;
  order_index: number;
}
