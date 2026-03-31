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
  icon: string | null;
  order_index: number;
}

export interface ServicePayload {
  title: string;
  description: string;
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
  order_index: number;
}

export interface SectorPayload {
  name: string;
  description: string;
  icon: string;
  order_index: number;
}
